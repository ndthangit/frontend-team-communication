import React, { useState } from 'react';
import type {Team} from "../../../types/team.ts";
import {TeamSidebar} from "./TeamSidebar.tsx";
import {PostFeed} from "./PostFeed.tsx";
import {TeamDetailHeader} from "./TeamDetailHeader.tsx";
//
// const mockPosts: Post[] = [
//     {
//         id: '1',
//         groupId: 'team1',
//         channelId: 'general',
//         authorEmail: 'tranduc.duy@example.com',
//         author: {
//             email: 'tranduc.duy@example.com',
//             firstName: 'Tran Duc',
//             lastName: 'Duy',
//             status: 'online',
//         },
//         content: 'Mình đã gửi mail thông tin chương trình đến các bạn đăng ký, các bạn check mail và phản hồi xác nhận tham gia office tour NAB Vietnam nhé',
//         createdAt: new Date('2025-10-11T10:36:00'),
//         likes: 3,
//         comments: [
//             {
//                 id: '1-1',
//                 postId: '1',
//                 authorEmail: 'nguyen.vana@example.com',
//                 author: {
//                     email: 'nguyen.vana@example.com',
//                     firstName: 'Nguyen Van',
//                     lastName: 'A',
//                     status: 'online',
//                 },
//                 content: 'Trả lời',
//                 createdAt: new Date('2025-10-11T11:15:00'),
//             },
//         ],
//     },
//     {
//         id: '2',
//         groupId: 'team1',
//         channelId: 'general',
//         author: {
//             email: 'ttdmst@example.com',
//             firstName: 'Trung tam Doi moi',
//             lastName: 'Sang tao',
//             status: 'online',
//         },
//         content: 'Follow FB Fanpage Kênh thông tin Sinh viên Trường CNTT&TT, Đại học BKHN\n\nChào các em K67-Trường CNTT&TT,\nGiới thiệu với các em FB Fanpage Kênh thông tin Sinh viên Trường CNTT&TT, Đại học BKHN',
//         createdAt: new Date('2025-10-11T15:27:00'),
//         likes: 12,
//         comments: [],
//     },
// ];

interface TeamDetailProps {
    team: Team;
    onBack: () => void;
}

export const TeamDetail: React.FC<TeamDetailProps> = ({ team, onBack }) => {
    const [activeTab, setActiveTab] = useState('posts');
    const [activeChannel, setActiveChannel] = useState('general');


    return (
        <div className="flex h-screen bg-gray-50">
            <TeamSidebar
                team={team}
                onBack={onBack}
                activeChannel={activeChannel}
                onChannelSelect={setActiveChannel}
            />

            <main className="flex-1 flex flex-col overflow-hidden">
                <TeamDetailHeader activeTab={activeTab} onTabChange={setActiveTab} />
                <PostFeed teamId={team.id}  />
            </main>
        </div>
    );
};
