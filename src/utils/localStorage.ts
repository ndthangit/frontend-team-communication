import type { User } from '../types';

const CURRENT_USER_KEY = 'currentUser';
const USERS_KEY = 'users';
//
// const defaultUser: User = {
//     email: 'john.doe@example.com',
//     firstName: 'John',
//     lastName: 'Doe',
//     dateOfBirth: '',
//     address: '',
//     gender: '',
//     occupation: '',
//     status: 'online',
// };

const defaultUsers: User[] = [
    {
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '',
        address: '',
        gender: '',
        occupation: '',
        status: 'online',
    },
    {
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '',
        address: '',
        gender: '',
        occupation: '',
        status: 'online',
    },
    {
        email: 'bob.johnson@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        dateOfBirth: '',
        address: '',
        gender: '',
        occupation: '',
        status: 'offline',
    },
];

// Kiểm tra tính hợp lệ của user data
const isValidUser = (user: any): user is User => {
    return (
        user &&
        typeof user === 'object' &&
        typeof user.email === 'string' &&
        typeof user.firstName === 'string' &&
        typeof user.lastName === 'string'
    );
};

// Lấy current user từ localStorage
export const getCurrentUser = (): User | null => {
    try {
        const stored = localStorage.getItem(CURRENT_USER_KEY);
        if (stored) {
            const user = JSON.parse(stored);
            if (isValidUser(user)) {
                return user;
            }
        }
        return null;
    } catch (error) {
        console.error('Failed to get current user:', error);
        return null;
    }
};

// Lưu current user vào localStorage
export const setCurrentUser = (user: User | null, skipUsersUpdate = false): void => {
    try {
        if (user === null) {
            localStorage.removeItem(CURRENT_USER_KEY);
            return;
        }

        if (!isValidUser(user)) {
            console.error('Invalid user data');
            return;
        }

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

        // Đồng thời cập nhật trong danh sách users nếu cần (tránh vòng lặp vô hạn)
        if (!skipUsersUpdate) {
            updateUser(user);
        }
    } catch (error) {
        console.error('Failed to save current user:', error);
    }
};

export const getUsers = (): User[] => {
    try {
        const stored = localStorage.getItem(USERS_KEY);
        if (stored) {
            const users = JSON.parse(stored);
            // Validate each user
            return Array.isArray(users) ? users.filter(isValidUser) : defaultUsers;
        }
        localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
        return defaultUsers;
    } catch (error) {
        console.error('Failed to get users:', error);
        return defaultUsers;
    }
};

export const setUsers = (users: User[]): void => {
    try {
        // Filter out invalid users before saving
        const validUsers = users.filter(isValidUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(validUsers));
    } catch (error) {
        console.error('Failed to save users:', error);
    }
};

export const addUser = (user: User): void => {
    if (!isValidUser(user)) {
        console.error('Invalid user data');
        return;
    }

    const users = getUsers();
    const exists = users.find(u => u.email === user.email);
    if (!exists) {
        setUsers([...users, user]);
    } else {
        // Nếu user đã tồn tại, cập nhật thông tin
        updateUser(user);
    }
};

export const removeUser = (email: string): void => {
    try {
        const users = getUsers();
        const filteredUsers = users.filter(u => u.email !== email);
        setUsers(filteredUsers);

        // Nếu user bị xóa là current user, xóa current user
        const currentUser = getCurrentUser();
        if (currentUser?.email === email) {
            setCurrentUser(null);
        }
    } catch (error) {
        console.error('Failed to remove user:', error);
    }
};

export const updateUser = (user: User): void => {
    if (!isValidUser(user)) {
        console.error('Invalid user data');
        return;
    }

    try {
        const users = getUsers();
        const index = users.findIndex(u => u.email === user.email);
        if (index !== -1) {
            users[index] = user;
            setUsers(users);
        } else {
            // Nếu user chưa tồn tại, thêm mới
            addUser(user);
        }

        // Nếu user được cập nhật là current user, cập nhật current user (tránh vòng lặp vô hạn)
        const currentUser = getCurrentUser();
        if (currentUser?.email === user.email) {
            setCurrentUser(user, true); // skipUsersUpdate = true để tránh vòng lặp
        }
    } catch (error) {
        console.error('Failed to update user:', error);
    }
};

// Lấy user theo email
export const getUserByEmail = (email: string): User | null => {
    try {
        const users = getUsers();
        return users.find(u => u.email === email) || null;
    } catch (error) {
        console.error('Failed to get user by email:', error);
        return null;
    }
};

// Làm mới cache và đồng bộ với server (sử dụng khi fetch user từ API)
export const refreshCurrentUserFromServer = async (fetchUserFn: () => Promise<User>): Promise<User | null> => {
    try {
        const user = await fetchUserFn();
        if (isValidUser(user)) {
            setCurrentUser(user);
            return user;
        }
        return null;
    } catch (error) {
        console.error('Failed to refresh user from server:', error);
        return getCurrentUser(); // Fallback to cached user
    }
};

// Xóa tất cả dữ liệu user (dùng khi logout)
export const clearAllUserData = (): void => {
    try {
        localStorage.removeItem(CURRENT_USER_KEY);
        localStorage.removeItem(USERS_KEY);
    } catch (error) {
        console.error('Failed to clear all user data:', error);
    }
};
