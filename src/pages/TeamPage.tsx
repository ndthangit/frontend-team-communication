import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import type {Team} from "../types/team.ts";
import {TeamDetail} from "./YourTeam/MainTeam/TeamDetail.tsx";

export const TeamPage: React.FC = () => {
    const {teamId} = useParams<{ teamId: string; }>(); // Lấy ID từ URL
    const navigate = useNavigate();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeamDetail = async () => {
            if (!teamId) return;
            setLoading(true);
            try {
                // CÁCH 1: Lấy từ LocalStorage (nhanh, đồng bộ với Grid)
                const savedGroupInfo = localStorage.getItem('groupInfo');

                if (savedGroupInfo) {
                    const teams: Team[] = JSON.parse(savedGroupInfo);
                    const foundTeam = teams.find(t => t.id === teamId);
                    if (foundTeam) {
                        setTeam(foundTeam);
                        setLoading(false);
                        return;
                    }
                }

                // CÁCH 2: Nếu không có trong LocalStorage thì gọi API (Fallback)
                // const res = await getTeamById(teamId);
                // setTeam(res.data);

                // Demo tạm thời nếu không tìm thấy
                console.warn(`Không tìm thấy team với id: ${teamId}`);
            } catch (error) {
                console.error("Lỗi tải thông tin team:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamDetail();
    }, [teamId]);

    const handleBack = () => {
        navigate('/teams'); // Quay lại trang danh sách
    };

    if (loading) return <div className="p-8">Đang tải dữ liệu lớp học...</div>;

    if (!team) return <div className="p-8">Không tìm thấy lớp học!</div>;

    // Render component TeamDetail và truyền dữ liệu vào
    return (
        <TeamDetail
            team={team}
            onBack={handleBack}
        />
    );
};

