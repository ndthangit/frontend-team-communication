import { useState, useEffect, useCallback } from 'react';
import {
    getCurrentUser,
    setCurrentUser as saveCurrentUser
} from '../utils/localStorage';
import { getUserInfoByEmail } from '../service/UserService';
import type { User } from '../types';

interface UseCurrentUserReturn {
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    refreshUser: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
}

export const useCurrentUser = (): UseCurrentUserReturn => {
    const [currentUser, setCurrentUserState] = useState<User | null>(getCurrentUser);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Tự động lưu vào localStorage khi currentUser thay đổi
    useEffect(() => {
        if (currentUser) {
            saveCurrentUser(currentUser);
        }
    }, [currentUser]);

    // Hàm set currentUser với đồng bộ localStorage
    const setCurrentUser = useCallback((user: User | null) => {
        setCurrentUserState(user);
        saveCurrentUser(user);
        setError(null);
    }, []);

    // Hàm refresh user từ server
    const refreshUser = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await new Promise<User | null>((resolve) => {
                getUserInfoByEmail(
                    (response) => {
                        if (response.data) {
                            resolve(response.data);
                        } else {
                            resolve(null);
                        }
                    },
                    {
                        rest: (error) => {
                            console.error('Failed to fetch user:', error);
                            resolve(null);
                        }
                    }
                );
            });

            if (response) {
                setCurrentUserState(response);
                saveCurrentUser(response);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to refresh user';
            setError(errorMessage);
            console.error('Error refreshing user:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Tự động refresh user khi mount nếu không có currentUser
    useEffect(() => {
        const checkAndRefresh = async () => {
            const storedUser = getCurrentUser();
            if (!storedUser) {
                // Nếu không có current user, thử fetch từ server
                await refreshUser();
            }
        };

        checkAndRefresh();
    }, []);

    return {
        currentUser,
        setCurrentUser,
        refreshUser,
        isLoading,
        error
    };
};
