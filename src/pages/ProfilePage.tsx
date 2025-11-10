import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Save, User as UserIcon } from 'lucide-react';
import type { AxiosResponse } from 'axios';
import './ProfilePage.css';
import type { User } from "../types";
import UserInfo from '../components/UserInfo';
import {createPerson} from "../service/ObjectService.ts";

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { keycloak } = useKeycloak();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [userInfo, setUserInfo] = useState<User>({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        gender: '',
        dateOfBirth: undefined,
        occupation: '',
        address: '',
        phoneNumber: ''
    });

    useEffect(() => {
        const loadUserInfo = () => {
            const savedUserInfo = localStorage.getItem('userInfo');
            if (savedUserInfo) {
                try {
                    const userData = JSON.parse(savedUserInfo);
                    setUserInfo(prev => ({
                        ...prev,
                        ...userData,
                        email: userData.email || keycloak.tokenParsed?.email || '',
                        firstName: userData.firstName || keycloak.tokenParsed?.given_name || '',
                        lastName: userData.lastName || keycloak.tokenParsed?.family_name || '',
                    }));
                } catch (err) {
                    console.error('Error parsing user info from localStorage:', err);
                    setUserInfo(prev => ({
                        ...prev,
                        firstName: keycloak.tokenParsed?.given_name || '',
                        lastName: keycloak.tokenParsed?.family_name || '',
                        email: keycloak.tokenParsed?.email || '',
                    }));
                }
            } else {
                setUserInfo(prev => ({
                    ...prev,
                    firstName: keycloak.tokenParsed?.given_name || '',
                    lastName: keycloak.tokenParsed?.family_name || '',
                    email: keycloak.tokenParsed?.email || '',
                }));
            }
            setInitialLoading(false);
        };

        if (keycloak.tokenParsed) {
            loadUserInfo();
        }
    }, [keycloak.tokenParsed]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await createPerson(
                userInfo,
                (response: AxiosResponse) => {
                    const updatedData = response.data;
                    localStorage.setItem('userInfo', JSON.stringify(updatedData));
                    setSuccess('Profile updated successfully!');
                    console.log('Profile updated successfully:', updatedData);
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
                },
                {
                    400: () => setError('Invalid data. Please check again.'),
                    500: () => setError('Server error. Please try again later.'),
                    rest: () => setError('An error occurred. Please try again.')
                }
            );
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="profile-container">
                <div className="profile-content">
                    <div className="profile-card">
                        <p>Loading information...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-content">
                <div className="profile-card">
                    <div className="profile-title">
                        <UserIcon className="w-8 h-8 text-blue-600" />
                        <h1>Update Personal Information</h1>
                    </div>

                    {error && (
                        <div className="alert alert-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="alert alert-success">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <UserInfo user={userInfo} onInputChange={handleInputChange} />
                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="btn-cancel"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-save"
                                disabled={loading}
                            >
                                <Save className="w-5 h-5" />
                                {loading ? 'Saving...' : 'Save Information'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export { ProfilePage };