/**
 * User Storage Helper
 * 
 * Helper utilities để quản lý user data giữa localStorage và API
 * Cung cấp các hàm tiện ích để fetch và đồng bộ user data
 */

import type { User } from '../types';
import {
    getCurrentUser,
    setCurrentUser,
    clearAllUserData,
    getUserByEmail,
    updateUser as updateUserInStorage
} from './localStorage';
import { getUserInfoByEmail, updateUser as updateUserAPI } from '../service/UserService';
import type { ErrorHandlers } from '../api';

/**
 * Fetch và lưu current user từ server
 */
export const fetchAndCacheCurrentUser = async (): Promise<User | null> => {
    try {
        return new Promise<User | null>((resolve) => {
            getUserInfoByEmail(
                (response) => {
                    if (response.data) {
                        setCurrentUser(response.data);
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
    } catch (error) {
        console.error('Failed to fetch and cache user:', error);
        return null;
    }
};

/**
 * Cập nhật user và đồng bộ với server
 */
export const updateUserAndSync = async (
    user: User,
    errorHandlers?: ErrorHandlers
): Promise<boolean> => {
    try {
        // Cập nhật localStorage trước
        updateUserInStorage(user);

        // Đồng bộ với server
        return new Promise((resolve) => {
            updateUserAPI(
                user,
                (response) => {
                    if (response.data) {
                        // Cập nhật lại localStorage với data từ server
                        updateUserInStorage(response.data);
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                },
                {
                    ...errorHandlers,
                    rest: (error) => {
                        console.error('Failed to sync user with server:', error);
                        errorHandlers?.rest?.(error);
                        resolve(false);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Failed to update and sync user:', error);
        return false;
    }
};

/**
 * Logout user - xóa tất cả dữ liệu user
 */
export const logoutUser = (): void => {
    clearAllUserData();
};

/**
 * Lấy user hiện tại, fetch từ server nếu cần
 */
export const ensureCurrentUser = async (): Promise<User | null> => {
    let user = getCurrentUser();

    if (!user) {
        // Nếu không có user, fetch từ server
        user = await fetchAndCacheCurrentUser();
    }

    return user;
};

/**
 * Force refresh user từ server và update localStorage
 */
export const forceRefreshCurrentUser = async (): Promise<User | null> => {
    return await fetchAndCacheCurrentUser();
};

/**
 * Helper để lấy user by email
 */
export const getUser = (email: string): User | null => {
    return getUserByEmail(email);
};

/**
 * Kiểm tra xem user có đang đăng nhập không
 */
export const isUserLoggedIn = (): boolean => {
    return getCurrentUser() !== null;
};

/**
 * Export các hàm chính từ localStorage để dễ truy cập
 */
export {
    getCurrentUser,
    setCurrentUser,
    clearAllUserData
};
