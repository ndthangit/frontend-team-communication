import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from '@react-keycloak/web';
import { Save, User as UserIcon } from 'lucide-react';
import './ProfilePage.css';
import type { User } from "../types";
import UserInfo from '../components/UserInfo';
import { createUser, getUserInfoByEmail, updateUser } from "../service/UserService.ts";
import { getCurrentUser, setCurrentUser } from '../utils/localStorage';

const ProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { keycloak } = useKeycloak();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [userInfo, setUserInfo] = useState<User>({
        firstName: '',
        lastName: '',
        email: '',
        dateOfBirth: '',
        address: '',
        gender: '',
        occupation: ''
    });

    useEffect(() => {
        const loadUserInfo = async () => {
            try {
                // Ưu tiên lấy từ currentUser trong localStorage
                const currentUser = getCurrentUser();

                if (currentUser) {
                    // Có currentUser -> dùng dữ liệu đã lưu
                    setUserInfo({
                        ...currentUser,
                        email: currentUser.email || keycloak.tokenParsed?.email || '',
                        firstName: currentUser.firstName || keycloak.tokenParsed?.given_name || '',
                        lastName: currentUser.lastName || keycloak.tokenParsed?.family_name || '',
                    });
                } else {
                    // Không có currentUser -> gọi API lấy dữ liệu
                    const res = await getUserInfoByEmail();
                    if (res?.data) {
                        // Tìm thấy người dùng trong DB
                        const userData = res.data;
                        setUserInfo(userData);
                        setCurrentUser(userData); // Lưu vào localStorage
                    } else {
                        // Không tìm thấy người dùng trong DB -> giữ nguyên form trống để tạo mới
                        setUserInfo(prev => ({
                            ...prev,
                            firstName: keycloak.tokenParsed?.given_name || '',
                            lastName: keycloak.tokenParsed?.family_name || '',
                            email: keycloak.tokenParsed?.email || '',
                        }));
                    }
                }
            } catch (err) {
                console.error('Error loading user info:', err);
                // Fallback: sử dụng thông tin từ keycloak
                setUserInfo(prev => ({
                    ...prev,
                    firstName: keycloak.tokenParsed?.given_name || '',
                    lastName: keycloak.tokenParsed?.family_name || '',
                    email: keycloak.tokenParsed?.email || '',
                }));
            } finally {
                setInitialLoading(false);
            }
        };

        loadUserInfo();
    }, [keycloak]);

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
            const currentUser = getCurrentUser();
            let action;

            if (currentUser) {
                // Có currentUser -> dùng API update
                action = updateUser;
            } else {
                // Không có currentUser -> dùng API create
                action = createUser;
            }

            await action(
                userInfo,
                () => {
                    setSuccess('Profile updated successfully!');
                    // Cập nhật currentUser trong localStorage sau khi thành công
                    setCurrentUser(userInfo);
                    setTimeout(() => {
                        navigate('/');
                    }, 1500);
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