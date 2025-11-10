export const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

export const getRandomColor = (id: string): string => {
    const colors = [
        'bg-orange-500',
        'bg-blue-500',
        'bg-red-600',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
    ];
    const index = parseInt(id) % colors.length;
    return colors[index];
};
