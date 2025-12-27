import type { User } from '../types';

export type TeamUser = User & {
    teamId: string;
    role: 'Owner' | 'Member' | 'Guest';
};

export const getUserFullName = (user: User): string => {
    return `${user.firstName} ${user.lastName}`.trim();
};

export const getUserInitials = (user: User): string => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
};

export const createTeamUser = (
    user: User,
    teamId: string,
    role: 'Owner' | 'Member' | 'Guest' = 'Member'
): TeamUser => {
    return {
        ...user,
        teamId,
        role,
    };
};
