export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
  avatarUrl?: string;
  gender?:string;
  occupation?: string;
}

export interface Channel {
  id: string;
  teamId: string;
  name: string;
  description: string;
  isPrivate: boolean;
}

export interface Member {
  id: string;
  teamId: string;
  name: string;
  email: string;
  role: 'Owner' | 'Member' | 'Guest';
  avatarUrl?: string;
  status: 'online' | 'offline' | 'busy' | 'away';
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
  teamId: string;
  channelId?: string;
  authorId: string;
  author: Member;
  content: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
  attachments?: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author: Member;
  content: string;
  createdAt: Date;
}

export interface Call {
  id: string;
  teamId: string;
  participants: Member[];
  type: 'voice' | 'video';
  status: 'ringing' | 'active' | 'ended';
  startedAt?: Date;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: Member;
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
  participants: Member[];
  lastMessage?: ChatMessage;
  updatedAt: Date;
  unreadCount: number;
}

export type NavigationView = 'channels' | 'files' | 'members' | 'calls' | 'posts' | 'chat';
