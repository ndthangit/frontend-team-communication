import React, { useRef } from 'react';
import { MoreVertical, Grid, FolderOpen, Edit3 } from 'lucide-react';
import { TeamDropdownMenu } from './TeamDropdownMenu';
import type {Team} from "../../types/team.ts";
import {getInitials, getRandomColor} from "../../utils/teamHelper.ts";

interface TeamCardProps {
    team: Team;
    openMenuId: string | null;
    onToggleMenu: (teamId: string, e: React.MouseEvent) => void;
    onMenuAction: (action: string, team: Team, e: React.MouseEvent) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({
                                                      team,
                                                      openMenuId,
                                                      onToggleMenu,
                                                      onMenuAction,
                                                  }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    return (
        <div className="border border-gray-300 rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer bg-white">
            <div className="flex items-start gap-3 mb-4">
                {team.avatarUrl ? (
                    <img
                        src={team.avatarUrl}
                        alt={team.name}
                        className="w-16 h-16 rounded-lg object-cover"
                    />
                ) : (
                    <div className={`w-16 h-16 rounded-lg ${getRandomColor(team.id)} flex items-center justify-center text-white text-xl font-bold`}>
                        {getInitials(team.name)}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                        {team.name}
                    </h3>
                </div>
                <div className="relative flex-shrink-0" ref={openMenuId === team.id ? menuRef : null}>
                    <button
                        onClick={(e) => onToggleMenu(team.id, e)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {openMenuId === team.id && (
                        <TeamDropdownMenu team={team} onAction={onMenuAction} />
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Xem nội dung">
                    <Grid className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Tệp">
                    <FolderOpen className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Bài tập">
                    <Edit3 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
