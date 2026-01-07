import React, { useEffect, useState } from 'react';
import './LandingPage.css'; // File CSS này sẽ được dùng cho giao diện mới
import { useKeycloak } from "@react-keycloak/web";
import { useNavigate } from 'react-router-dom';
import HomePageNotLogin from "./HomePageNotLogin.tsx";
import type { User } from "../types";
import { User as UserIcon, LogOut, Users, Video, Settings } from 'lucide-react';
import { getUserInfoByEmail } from "../service/UserService.ts";
import { getTeam } from "../service/TeamService.ts";
import { TeamGrid } from './YourTeam/TeamGrid.tsx';

const HomePage: React.FC = () => {
    const { keycloak, initialized } = useKeycloak();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Bắt đầu với trạng thái đang tải
    const [userInfo, setUserInfo] = useState<User | null>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fetchUserInfo = async () => {
        // Chỉ chạy khi keycloak đã khởi tạo và người dùng đã đăng nhập

        const savedUserInfo = localStorage.getItem('userInfo');
        const saveGroupInfo = localStorage.getItem('groupInfo')
        if (savedUserInfo == null) {
            try {
                const res = await getUserInfoByEmail();
                if (saveGroupInfo == null) {
                    const resGroup = await getTeam();
                    localStorage.setItem('groupInfo', JSON.stringify(resGroup?.data));
                }

                if (res?.data) {
                    // Tìm thấy người dùng trong DB
                    const userData = res.data;
                    setUserInfo(userData);
                    localStorage.setItem('userInfo', JSON.stringify(userData));
                } else {
                    // Đã xác thực nhưng không có trong DB -> ciuyển đến trang profile
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

    };

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo, initialized, keycloak.authenticated]);

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
    else {
        navigate('/teams');
    }
};

export default HomePage;
