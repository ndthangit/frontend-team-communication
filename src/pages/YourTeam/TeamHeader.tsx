import React, { useState, useRef } from 'react';
import { MoreVertical, UserPlus, Users, Plus } from 'lucide-react';
import {useClickOutside} from "../../hooks/handleClickOutside.tsx";

interface TeamHeaderProps {
    onJoinTeam: () => void;
    onCreateTeam: () => void;
}

export const TeamHeader: React.FC<TeamHeaderProps> = ({ onJoinTeam, onCreateTeam }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useClickOutside(dropdownRef as React.RefObject<HTMLElement>, () => setIsDropdownOpen(false));

    const handleJoinTeam = () => {
        setIsDropdownOpen(false);
        onJoinTeam();
    };

    const handleCreateTeam = () => {
        setIsDropdownOpen(false);
        onCreateTeam();
    };

    return (
        <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Nhóm</h1>
            <div className="flex items-center gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                        <UserPlus className="w-5 h-5 text-gray-700" />
                        <span className="text-sm font-medium text-gray-700">Tham gia hoặc tạo nhóm</span>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                            <button
                                onClick={handleJoinTeam}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <Users className="w-5 h-5 text-gray-600" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Tham gia nhóm bằng mã</div>
                                    <div className="text-xs text-gray-500">Nhập mã để tham gia nhóm</div>
                                </div>
                            </button>
                            <button
                                onClick={handleCreateTeam}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <Plus className="w-5 h-5 text-gray-600" />
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Tạo nhóm</div>
                                    <div className="text-xs text-gray-500">Tạo nhóm mới của riêng bạn</div>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
