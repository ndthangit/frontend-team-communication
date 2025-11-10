import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TeamHeader } from './TeamHeader';
import { TeamCard } from './TeamCard';
import {useClickOutside} from "../../hooks/handleClickOutside.tsx";
import type {Team} from "../../types/team.ts";
import {JoinTeamModal} from "./JoinTeamModal.tsx";
import {CreateTeamModal} from "./CreateTeamModal.tsx";

export const YourTeam: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isExpanded, setIsExpanded] = useState(true);
    const [loading, setLoading] = useState(false);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useClickOutside(menuRef as React.RefObject<HTMLElement>, () => setOpenMenuId(null));

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const mockTeams: Team[] = [
                { id: '1', name: 'Khoa học máy tính 01-K67', hidden: false },
                { id: '2', name: 'K67-Trường CNTT&TT', avatarUrl: 'https://via.placeholder.com/80?text=SOICT', hidden: false },
                { id: '3', name: 'Trường CNTT&TT - Chi bộ Sinh viên', avatarUrl: 'https://via.placeholder.com/80?text=CB', hidden: false },
                { id: '4', name: 'KHMT01-K67', hidden: false },
                { id: '5', name: 'BKAI Students', avatarUrl: 'https://via.placeholder.com/80?text=BKAI', hidden: false },
                { id: '6', name: '20241 - 154015 - Nhập môn TTNT', hidden: false },
            ];
            setTeams(mockTeams);
        } catch (error) {
            console.error('Error loading teams:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleMenu = (teamId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === teamId ? null : teamId);
    };

    const handleMenuAction = (action: string, team: Team, e: React.MouseEvent) => {
        e.stopPropagation();
        console.log(`Action: ${action} for team: ${team.name}`);
        setOpenMenuId(null);
    };
    const handleJoinTeam = (code: string) => {
        console.log('Joining team with code:', code);
        setIsJoinModalOpen(false);
    };

    const handleCreateTeam = (name: string) => {
        console.log('Creating team with name:', name);
        setIsCreateModalOpen(false);
    };

    const visibleTeams = teams.filter(team => !team.hidden);

    return (
        <div className="min-h-screen bg-white">
            <TeamHeader
                onJoinTeam={() => setIsJoinModalOpen(true)}
                onCreateTeam={() => setIsCreateModalOpen(true)}
            />

            <JoinTeamModal
                isOpen={isJoinModalOpen}
                onClose={() => setIsJoinModalOpen(false)}
                onSubmit={handleJoinTeam}
            />

            <CreateTeamModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateTeam}
            />

            <div className="px-6 py-6">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 mb-4 hover:bg-gray-50 px-2 py-1 rounded transition-colors"
                >
                    {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    )}
                    <h2 className="text-lg font-medium text-gray-700">Lớp học</h2>
                </button>

                {isExpanded && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {loading ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">Đang tải...</p>
                            </div>
                        ) : visibleTeams.length === 0 ? (
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500">Không có nhóm nào</p>
                            </div>
                        ) : (
                            visibleTeams.map((team) => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    openMenuId={openMenuId}
                                    onToggleMenu={toggleMenu}
                                    onMenuAction={handleMenuAction}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default YourTeam;
