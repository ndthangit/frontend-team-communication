import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type {
    User,
    FileItem,
    Post,
    Comment,
    Conversation,
    ChatMessage,
    Call,
    NavigationView,
} from '../types';
import type { Team } from "../types/team.ts";
import {
    getCurrentUser,
    setCurrentUser as saveCurrentUser,
    getUsers as getStoredUsers,
    updateUser as updateStoredUser,
    addUser as addStoredUser,
    removeUser as removeStoredUser
} from '../utils/localStorage';

interface AppContextType {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    teams: Team[];
    currentTeam: Team | null;
    setCurrentTeam: (team: Team | null) => void;
    currentView: NavigationView;
    setCurrentView: (view: NavigationView) => void;
    users: User[];
    addUser: (user: User) => void;
    removeUser: (email: string) => void;
    updateUser: (user: User) => void;
    files: FileItem[];
    addFile: (file: FileItem) => void;
    deleteFile: (id: string) => void;
    renameFile: (id: string, newName: string) => void;
    posts: Post[];
    addPost: (post: Post) => void;
    likePost: (id: string) => void;
    addComment: (postId: string, content: string) => void;
    conversations: Conversation[];
    currentConversation: Conversation | null;
    setCurrentConversation: (conversation: Conversation | null) => void;
    createConversation: (participants: User[], type: 'direct' | 'group', name?: string) => Conversation;
    sendMessage: (conversationId: string, content: string) => void;
    getMessages: (conversationId: string) => ChatMessage[];
    calls: Call[];
    startCall: (type: 'voice' | 'video', participants: User[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// export const useApp = () => {
//     const context = useContext(AppContext);
//     if (!context) {
//         throw new Error('useApp must be used within AppProvider');
//     }
//     return context;
// };

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    // Lấy current user từ localStorage khi khởi tạo
    const [currentUser, setCurrentUserState] = useState<User | null>(getCurrentUser);

    // Lấy danh sách users từ localStorage
    const [users, setUsers] = useState<User[]>(getStoredUsers);

    // Đồng bộ currentUser với localStorage khi thay đổi
    useEffect(() => {
        if (currentUser) {
            saveCurrentUser(currentUser);
        }
    }, [currentUser]);

    // Hàm set current user với đồng bộ localStorage
    const setCurrentUser = (user: User | null) => {
        setCurrentUserState(user);
        saveCurrentUser(user);
    };

    const [teams, setTeams] = useState<Team[]>([
        { id: 'team1', name: 'Development Team', hidden: false },
        { id: 'team2', name: 'Marketing Team', hidden: false },
    ]);

    const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
    const [currentView, setCurrentView] = useState<NavigationView>('posts');
    const [files, setFiles] = useState<FileItem[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [calls, setCalls] = useState<Call[]>([]);

    // Hàm thêm user với đồng bộ localStorage
    const addUser = (user: User) => {
        addStoredUser(user);
        setUsers((prev) => {
            const exists = prev.find(u => u.email === user.email);
            return exists ? prev : [...prev, user];
        });
    };

    // Hàm xóa user với đồng bộ localStorage
    const removeUser = (email: string) => {
        removeStoredUser(email);
        setUsers((prev) => prev.filter((u) => u.email !== email));
    };

    // Hàm cập nhật user với đồng bộ localStorage
    const updateUser = (user: User) => {
        updateStoredUser(user);
        setUsers((prev) => {
            const index = prev.findIndex(u => u.email === user.email);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = user;
                return updated;
            }
            return [...prev, user];
        });
    };

    const addFile = (file: FileItem) => {
        setFiles((prev) => [...prev, file]);
    };

    const deleteFile = (id: string) => {
        setFiles((prev) => prev.filter((f) => f.id !== id));
    };

    const renameFile = (id: string, newName: string) => {
        setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, name: newName } : f)));
    };

    const addPost = (post: Post) => {
        setPosts((prev) => [post, ...prev]);
    };

    const likePost = (id: string) => {
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)));
    };

    const addComment = (postId: string, content: string) => {
        if (!currentUser) return;

        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            postId,
            authorEmail: currentUser.email,
            author: currentUser,
            content,
            createdAt: new Date(),
        };
        setPosts((prev) =>
            prev.map((p) => (p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p))
        );
    };

    const createConversation = (
        participants: User[],
        type: 'direct' | 'group',
        name?: string
    ): Conversation => {
        if (!currentUser) {
            throw new Error('No current user');
        }

        const newConversation: Conversation = {
            id: `conv-${Date.now()}`,
            teamId: currentTeam?.id || '',
            type,
            name,
            participants: [currentUser, ...participants],
            updatedAt: new Date(),
            unreadCount: 0,
        };
        setConversations((prev) => [newConversation, ...prev]);
        return newConversation;
    };

    const sendMessage = (conversationId: string, content: string) => {
        if (!currentUser) return;

        const newMessage: ChatMessage = {
            id: `msg-${Date.now()}`,
            conversationId,
            senderEmail: currentUser.email,
            sender: currentUser,
            content,
            createdAt: new Date(),
            isRead: false,
        };
        setMessages((prev) => [...prev, newMessage]);
        setConversations((prev) =>
            prev.map((c) =>
                c.id === conversationId
                    ? { ...c, lastMessage: newMessage, updatedAt: new Date() }
                    : c
            )
        );
    };

    const getMessages = (conversationId: string): ChatMessage[] => {
        return messages.filter((m) => m.conversationId === conversationId);
    };

    const startCall = (type: 'voice' | 'video', participants: User[]) => {
        if (!currentUser) return;

        const newCall: Call = {
            id: `call-${Date.now()}`,
            teamId: currentTeam?.id || '',
            participants: [currentUser, ...participants],
            type,
            status: 'ringing',
            startedAt: new Date(),
        };
        setCalls((prev) => [newCall, ...prev]);
    };

    const value: AppContextType = {
        currentUser,
        setCurrentUser,
        teams,
        currentTeam,
        setCurrentTeam,
        currentView,
        setCurrentView,
        users,
        addUser,
        removeUser,
        updateUser,
        files,
        addFile,
        deleteFile,
        renameFile,
        posts,
        addPost,
        likePost,
        addComment,
        conversations,
        currentConversation,
        setCurrentConversation,
        createConversation,
        sendMessage,
        getMessages,
        calls,
        startCall,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
