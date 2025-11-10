import React, { useEffect, useState } from 'react';
import './LandingPage.css'; // File CSS này sẽ được dùng cho giao diện mới
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from 'react-router-dom';
import HomePageNotLogin from "./HomePageNotLogin.tsx";
import type { User } from "../types";
import {getPersonInfoByEmail} from "../service/ObjectService.ts";
import { User as UserIcon, LogOut, Users, Video, Settings } from 'lucide-react';

const HomePage: React.FC = () => {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Bắt đầu với trạng thái đang tải
    const [userInfo, setUserInfo] = useState<User | null>(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            // Chỉ chạy khi keycloak đã khởi tạo và người dùng đã đăng nhập
            if (initialized && keycloak.authenticated) {
                if (keycloak.tokenParsed?.email) {
                    try {
                        const res = await getPersonInfoByEmail(keycloak.tokenParsed.email);

                        if ( res?.data.id) {
                            // Tìm thấy người dùng trong DB
                            const userData = res.data;
                            setUserInfo(userData);
                            localStorage.setItem('userInfo', JSON.stringify(userData));
                        } else {
                            // Đã xác thực nhưng không có trong DB -> chuyển đến trang profile
                            navigate('/profile');
                        }


                    } catch (error) {
                        console.error("Lỗi khi lấy thông tin người dùng:", error);
                        // Gặp lỗi cũng chuyển đến trang profile
                        navigate('/profile');
                    } finally {
                        setLoading(false);
                    }
                } else {
                     console.error("Keycloak đã xác thực nhưng không tìm thấy email trong token.");
                     setLoading(false);
                }
            } else if (initialized && !keycloak.authenticated) {
                // Nếu chưa đăng nhập, dừng trạng thái tải
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [initialized, keycloak.authenticated, keycloak.tokenParsed?.email, navigate]);

    const handleLogout = () => {
        // Chuyển hướng về trang chủ sau khi đăng xuất
        keycloak.logout({ redirectUri: window.location.origin });
    };

    // Trong khi Keycloak đang khởi tạo hoặc đang tải dữ liệu
    if (!initialized || loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải...</p>
            </div>
        );
    }

    // Nếu chưa đăng nhập, hiển thị trang đăng nhập
    if (!keycloak.authenticated) {
        return <HomePageNotLogin />;
    }

    // --- Giao diện cho người dùng đã đăng nhập ---
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="logo">
                    <Video className="logo-icon" />
                    <span className="logo-text">TeamsMeet</span>
                </div>
                <div className="header-user-menu">
                    <span>Chào, {userInfo?.firstName || keycloak.tokenParsed?.preferred_username}</span>
                    <UserIcon className="user-avatar-icon" />
                    <button onClick={handleLogout} className="btn-logout">
                        <LogOut size={18} />
                        Đăng xuất
                    </button>
                </div>
            </header>
            <main className="dashboard-main">
                <h1 className="dashboard-welcome">Chào mừng trở lại!</h1>
                <p className="dashboard-subtitle">Bắt đầu cuộc họp hoặc quản lý nhóm của bạn từ đây.</p>

                <div className="dashboard-cards">
                    <div className="card" onClick={() => navigate('/main')}>
                        <Video size={40} className="card-icon" />
                        <h3 className="card-title">Tạo cuộc họp mới</h3>
                        <p className="card-description">Bắt đầu một cuộc gọi video ngay lập tức.</p>
                    </div>
                    <div className="card" onClick={() => navigate('/teams')}>
                        <Users size={40} className="card-icon" />
                        <h3 className="card-title">Quản lý nhóm</h3>
                        <p className="card-description">Xem và chỉnh sửa các nhóm của bạn.</p>
                    </div>
                    <div className="card" onClick={() => navigate('/profile')}>
                        <Settings size={40} className="card-icon" />
                        <h3 className="card-title">Cài đặt tài khoản</h3>
                        <p className="card-description">Cập nhật thông tin cá nhân của bạn.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
