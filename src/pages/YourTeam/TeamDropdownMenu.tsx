import React from 'react';
import { EyeOff, Settings, UserPlus, Link2, Tag } from 'lucide-react';
import type {Team} from "../../types/team.ts";

interface TeamDropdownMenuProps {
    team: Team;
    onAction: (action: string, team: Team, e: React.MouseEvent) => void;
}

export const TeamDropdownMenu: React.FC<TeamDropdownMenuProps> = ({ team, onAction }) => {
    return (
        <div className="absolute right-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
            <button
                onClick={(e) => onAction('hide', team, e)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
                <EyeOff className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Ẩn</span>
            </button>
            <button
                onClick={(e) => onAction('view', team, e)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Xem nhóm</span>
            </button>
            <button
                onClick={(e) => onAction('add-member', team, e)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
                <UserPlus className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Thêm thành viên</span>
            </button>
            <button
                onClick={(e) => onAction('copy-link', team, e)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
                <Link2 className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Sao chép liên kết</span>
            </button>
            <button
                onClick={(e) => onAction('manage-tags', team, e)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
            >
                <Tag className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Quản lý thẻ</span>
            </button>
        </div>
    );
};
