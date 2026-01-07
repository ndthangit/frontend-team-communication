export interface User {
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    address: string;
    avatarUrl?: string;
    gender: string;
    occupation: string;
    status?: 'online' | 'offline' | 'busy' | 'away';
}

export interface Channel {
    id: string;
    teamId: string;
    name: string;
    description?: string;
}

export interface FileItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    size?: number;
    modifiedAt: Date;
    path: string;
    parentId?: string;
}

export interface Post {
    id: string;
    groupId: string;
    channelId?: string;
    author: User | null;
    content: string;
    createdAt?: Date;
    likes: number;
    comments: Comment[];
}

export type CommentEventType = 'CREATED' | 'UPDATED' | 'DELETED';

export interface Comment {
    id: string;
    eventType?: CommentEventType;
    author: User | null;
    postId: string | null;  // Nếu null thì đây là comment trả lời cho comment khác
    parentId: string | null;  // ID của comment cha nếu đây là reply
    content: string;
    createdAt: Date | number;  // Có thể là timestamp (long) hoặc Date
    replies?: Comment[];  // Danh sách replies (computed on frontend)
}

export interface Call {
    id: string;
    teamId: string;
    participants: User[];
    type: 'voice' | 'video';
    status: 'ringing' | 'active' | 'ended';
    startedAt?: Date;
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    senderEmail: string;
    sender: User;
    content: string;
    createdAt: Date;
    isRead: boolean;
    attachments?: string[];
}

export interface Conversation {
    id: string;
    teamId: string;
    type: 'direct' | 'group';
    name?: string;
    participants: User[];
    lastMessage?: ChatMessage;
    updatedAt: Date;
    unreadCount: number;
}

export type NavigationView = 'channels' | 'files' | 'members' | 'calls' | 'posts' | 'chat';
