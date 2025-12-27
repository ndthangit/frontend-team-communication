import React from 'react';
import type { User } from '../types';

interface UserInfoProps {
    user: User;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ user, onInputChange }) => {
    return (
        <div className="form-grid">
            <div className="form-group">
                <label htmlFor="firstName">First Name *</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={user.firstName}
                    onChange={onInputChange}
                    required
                    placeholder="Enter your first name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Last Name *</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={user.lastName}
                    onChange={onInputChange}
                    required
                    placeholder="Enter your last name"
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={user.email}
                    onChange={onInputChange}
                    required
                    placeholder="email@example.com"
                    readOnly
                />
            </div>
            <div className="form-group">
                <label htmlFor="dateOfBirth">Date of Birth</label>
                <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={user.dateOfBirth || ''}
                    onChange={onInputChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select
                    id="gender"
                    name="gender"
                    value={user.gender}
                    onChange={onInputChange}
                >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="occupation">Occupation</label>

                <select
                    id="occupation"
                    name="occupation"
                    value={user.occupation}
                    onChange={onInputChange}

                >
                    <option value="">Select occupation</option>
                    <option value="Male">Teacher</option>
                    <option value="Female">Student</option>
                </select>
            </div>
            <div className="form-group full-width">
                <label htmlFor="address">Address</label>
                <textarea
                    id="address"
                    name="address"
                    value={user.address}
                    onChange={onInputChange}
                    rows={3}
                    placeholder="Enter your full address"
                />
            </div>
        </div>
    );
};

export default UserInfo;