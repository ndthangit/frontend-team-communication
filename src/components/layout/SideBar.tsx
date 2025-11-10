// SideBar.tsx
import React from 'react';
import {
    Bell,
    MessageSquare,
    Users,
    Briefcase,
    Calendar,
    Phone,
    Layers,
    Cloud,
    Plus,
    MoreHorizontal
} from 'lucide-react';
import {useLocation, useNavigate} from "react-router-dom";

// Biến kích thước để dễ dàng chỉnh sửa
const SIDEBAR_CONFIG = {
    WIDTH: 60,
    ICON_SIZE: 20,
    BUTTON_SIZE: 40, // w-10 h-10 = 40px
    PADDING_Y: 8, // py-2 = 8px
    PADDING_X: 8, // px-2 = 8px
    GRID_ICON_SIZE: 18,
    TOP_SECTION_PADDING: 12, // pt-3 pb-3 = 12px
};

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    path: string
}

const menuItems: MenuItem[] = [
    { id: 'activity', label: 'Hoạt động', icon: <Bell size={SIDEBAR_CONFIG.ICON_SIZE} />, path: '/activity' },
    { id: 'chat', label: 'Trò chuyện', icon: <MessageSquare size={SIDEBAR_CONFIG.ICON_SIZE} />, path: '/chat' },
    { id: 'teams', label: 'Nhóm', icon: <Users size={SIDEBAR_CONFIG.ICON_SIZE} />, path: '/teams' },
    { id: 'tasks', label: 'Nhiệm vụ', icon: <Briefcase size={SIDEBAR_CONFIG.ICON_SIZE} />, path: '/tasks' },
    { id: 'calendar', label: 'Lịch Outlook', icon: <Calendar size={SIDEBAR_CONFIG.ICON_SIZE} />, path: '/calendar' },
    { id: 'calls', label: 'Các Cuộc gọi', icon: <Phone size={SIDEBAR_CONFIG.ICON_SIZE} />, path: '/calls' },
    { id: 'clipchamp', label: 'Clipchamp', icon: <Layers size={SIDEBAR_CONFIG.ICON_SIZE} />, path: '/clipchamp' },
    { id: 'onedrive', label: 'OneDrive', icon: <Cloud size={SIDEBAR_CONFIG.ICON_SIZE} />, path: '/onedrive' },
];

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Tự động xác định activeItem dựa trên URL hiện tại
    const activeItem = menuItems.find(item => location.pathname.startsWith(item.path))?.id || 'teams';

    const handleNavigation = (path: string) => {
        navigate(path);
    };
    return (
        <div
            className="h-full bg-gray-100 flex flex-col border-r border-gray-300 fixed left-0 top-16 z-10"
            style={{
                height: 'calc(100vh - 64px)',
                width: `${SIDEBAR_CONFIG.WIDTH}px`
            }}
        >

            {/* Main Menu Items */}
            {/*<div className="flex-1 overflow-y-auto overflow-x-hidden py-2">*/}
            <div className="flex-shrink-0 flex flex-col items-center py-2 border-t border-gray-300 space-y-0 w-full">

            <nav className="flex flex-col items-center space-y-0 w-full">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigation(item.path)}
                            className={`
                                w-full flex items-center justify-center transition-all duration-200 relative group
                                ${activeItem === item.id ? 'bg-transparent' : 'hover:bg-gray-200'}
                            `}
                            style={{
                                paddingTop: `${SIDEBAR_CONFIG.PADDING_Y}px`,
                                paddingBottom: `${SIDEBAR_CONFIG.PADDING_Y}px`,
                                paddingLeft: `${SIDEBAR_CONFIG.PADDING_X}px`,
                                paddingRight: `${SIDEBAR_CONFIG.PADDING_X}px`
                            }}
                        >
                            {activeItem === item.id && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full" />
                            )}
                            <div
                                className={`
                                    flex items-center justify-center rounded-lg transition-colors duration-200 relative
                                    ${activeItem === item.id ? 'bg-indigo-600 text-white' : 'text-gray-600'}
                                `}
                                style={{
                                    width: `${SIDEBAR_CONFIG.BUTTON_SIZE}px`,
                                    height: `${SIDEBAR_CONFIG.BUTTON_SIZE}px`
                                }}
                            >
                                {item.icon}

                                {/* Tooltip hiển thị khi hover */}
                                <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                                    {item.label}
                                </div>
                            </div>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Bottom Section - More & Apps */}
            <div className="flex-shrink-0 flex flex-col items-center py-2 border-t border-gray-300 space-y-0 w-full">
                <button
                    className="w-full flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors relative group"
                    style={{
                        paddingTop: `${SIDEBAR_CONFIG.PADDING_Y}px`,
                        paddingBottom: `${SIDEBAR_CONFIG.PADDING_Y}px`,
                        paddingLeft: `${SIDEBAR_CONFIG.PADDING_X}px`,
                        paddingRight: `${SIDEBAR_CONFIG.PADDING_X}px`
                    }}
                >
                    <div
                        className="flex items-center justify-center text-gray-600"
                        style={{
                            width: `${SIDEBAR_CONFIG.BUTTON_SIZE}px`,
                            height: `${SIDEBAR_CONFIG.BUTTON_SIZE}px`
                        }}
                    >
                        <MoreHorizontal size={SIDEBAR_CONFIG.ICON_SIZE} />
                    </div>
                    {/* Tooltip for More */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        Thêm
                    </div>
                </button>

                <button
                    className="w-full flex items-center justify-center hover:bg-gray-200 rounded-lg transition-colors relative group"
                    style={{
                        paddingTop: `${SIDEBAR_CONFIG.PADDING_Y}px`,
                        paddingBottom: `${SIDEBAR_CONFIG.PADDING_Y}px`,
                        paddingLeft: `${SIDEBAR_CONFIG.PADDING_X}px`,
                        paddingRight: `${SIDEBAR_CONFIG.PADDING_X}px`
                    }}
                >
                    <div
                        className="flex items-center justify-center text-gray-600 border-2 border-dashed border-gray-400 rounded-lg"
                        style={{
                            width: `${SIDEBAR_CONFIG.BUTTON_SIZE}px`,
                            height: `${SIDEBAR_CONFIG.BUTTON_SIZE}px`
                        }}
                    >
                        <Plus size={SIDEBAR_CONFIG.ICON_SIZE} />
                    </div>
                    {/* Tooltip for Apps */}
                    <div className="absolute left-full ml-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                        Ứng dụng
                    </div>
                </button>
            </div>
        </div>
    );
}