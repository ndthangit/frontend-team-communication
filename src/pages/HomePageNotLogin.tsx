import React from 'react';
import { Video, Users, Shield, Zap } from 'lucide-react';
import './HomePageNotLogin.css';
import {useKeycloak} from "@react-keycloak/web";

const HomePageNotLogin: React.FC = () => {
    const { keycloak } = useKeycloak();

    const handleLogin = () => {
        keycloak.login()
    };

    const handleSignup = () => {
        keycloak.register()
    };

    return (
        <div className="home-not-login">
            {/* Header */}
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <Video className="logo-icon" />
                        <span className="logo-text">TeamsMeet</span>
                    </div>
                    <nav className="nav-menu">
                        <button onClick={handleLogin} className="btn-nav-login">
                            Đăng nhập
                        </button>
                        <button onClick={handleSignup} className="btn-nav-signup">
                            Đăng ký
                        </button>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <main className="main-content">
                <div className="hero-section">
                    <div className="hero-left">
                        <h1 className="hero-title">
                            Kết nối mọi người<br />
                            <span className="hero-gradient">mọi lúc, mọi nơi</span>
                        </h1>
                        <p className="hero-description">
                            Tạo cuộc họp video chất lượng cao, chia sẻ màn hình và cộng tác hiệu quả
                            với đồng đội của bạn. Đơn giản, bảo mật và miễn phí.
                        </p>
                        <div className="hero-actions">
                            <button onClick={handleSignup} className="btn-primary">
                                Bắt đầu ngay - Miễn phí
                            </button>
                            <button onClick={handleLogin} className="btn-secondary">
                                Đăng nhập
                            </button>
                        </div>
                    </div>
                    <div className="hero-right">
                        <div className="hero-image">
                            <div className="video-grid">
                                <div className="video-box video-box-1">
                                    <div className="avatar">👨‍💼</div>
                                    <span className="participant-name">John</span>
                                </div>
                                <div className="video-box video-box-2">
                                    <div className="avatar">👩‍💻</div>
                                    <span className="participant-name">Sarah</span>
                                </div>
                                <div className="video-box video-box-3">
                                    <div className="avatar">👨‍🎓</div>
                                    <span className="participant-name">Mike</span>
                                </div>
                                <div className="video-box video-box-4">
                                    <div className="avatar">👩‍🏫</div>
                                    <span className="participant-name">Emma</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <section className="features-section">
                    <h2 className="features-title">Tính năng nổi bật</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Video />
                            </div>
                            <h3>Video chất lượng cao</h3>
                            <p>Chất lượng hình ảnh sắc nét, âm thanh trong treo với công nghệ tiên tiến</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Users />
                            </div>
                            <h3>Cộng tác nhóm</h3>
                            <p>Làm việc nhóm hiệu quả với chat, chia sẻ file và quản lý thành viên</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Shield />
                            </div>
                            <h3>Bảo mật tuyệt đối</h3>
                            <p>Mã hóa end-to-end, đảm bảo dữ liệu của bạn luôn an toàn</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <Zap />
                            </div>
                            <h3>Nhanh chóng & dễ dùng</h3>
                            <p>Giao diện thân thiện, tạo cuộc họp chỉ với vài cú click</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePageNotLogin;