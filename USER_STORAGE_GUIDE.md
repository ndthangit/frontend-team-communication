# Hướng dẫn sử dụng User Storage System

## Tổng quan

Hệ thống quản lý thông tin user với localStorage đã được cải tiến với các tính năng:

- ✅ **Cache thông minh**: User data được cache với thời gian hết hạn (24h)
- ✅ **Validation**: Kiểm tra tính hợp lệ của dữ liệu trước khi lưu
- ✅ **Đồng bộ tự động**: Tự động đồng bộ giữa localStorage và state
- ✅ **API Integration**: Dễ dàng fetch và sync với server
- ✅ **Type-safe**: Full TypeScript support

## Cấu trúc

```
src/
├── utils/
│   ├── localStorage.ts      # Core localStorage utilities
│   └── userStorage.ts       # High-level user storage helpers
├── hooks/
│   └── useCurrentUser.tsx   # React hook để quản lý current user
└── context/
    └── AppContext.tsx       # Context với localStorage integration
```

## Cách sử dụng

### 1. Sử dụng trong Component với Hook

```tsx
import { useCurrentUser } from '@/hooks/useCurrentUser';

function MyComponent() {
    const { currentUser, setCurrentUser, refreshUser, isLoading, error } = useCurrentUser();

    // Lấy thông tin user
    console.log(currentUser);

    // Cập nhật user
    const updateProfile = () => {
        setCurrentUser({
            ...currentUser!,
            firstName: 'New Name'
        });
    };

    // Refresh từ server
    const handleRefresh = async () => {
        await refreshUser();
    };

    return (
        <div>
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {currentUser && (
                <div>
                    <h1>{currentUser.firstName} {currentUser.lastName}</h1>
                    <button onClick={handleRefresh}>Refresh</button>
                </div>
            )}
        </div>
    );
}
```

### 2. Sử dụng với Context

```tsx
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

function MyComponent() {
    const context = useContext(AppContext);
    
    if (!context) return null;

    const { currentUser, setCurrentUser, updateUser } = context;

    // Current user tự động được sync với localStorage
    console.log(currentUser);

    // Cập nhật user
    const handleUpdate = () => {
        if (currentUser) {
            updateUser({
                ...currentUser,
                firstName: 'Updated Name'
            });
        }
    };

    return <div>...</div>;
}
```

### 3. Sử dụng trực tiếp Utils

```tsx
import {
    fetchAndCacheCurrentUser,
    updateUserAndSync,
    ensureCurrentUser,
    forceRefreshCurrentUser,
    logoutUser,
    isUserLoggedIn
} from '@/utils/userStorage';

// Fetch user từ server và cache
const user = await fetchAndCacheCurrentUser();

// Cập nhật user và đồng bộ với server
const success = await updateUserAndSync(updatedUser);

// Đảm bảo có user (từ cache hoặc fetch mới)
const user = await ensureCurrentUser();

// Force refresh từ server
const user = await forceRefreshCurrentUser();

// Kiểm tra login status
if (isUserLoggedIn()) {
    // User đã login
}

// Logout
logoutUser();
```

### 4. Low-level localStorage Operations

```tsx
import {
    getCurrentUser,
    setCurrentUser,
    getUsers,
    addUser,
    removeUser,
    updateUser,
    getUserByEmail,
    clearUserCache,
    clearAllUserData
} from '@/utils/localStorage';

// Lấy current user (từ cache nếu có)
const user = getCurrentUser();

// Lưu current user
setCurrentUser(user);

// Xóa current user
setCurrentUser(null);

// Lấy tất cả users
const users = getUsers();

// Thêm user mới
addUser(newUser);

// Cập nhật user
updateUser(updatedUser);

// Xóa user theo email
removeUser('user@example.com');

// Lấy user theo email
const user = getUserByEmail('user@example.com');

// Xóa cache (nhưng giữ data trong localStorage chính)
clearUserCache();

// Xóa tất cả dữ liệu user (dùng khi logout)
clearAllUserData();
```

## Các tính năng chính

### Cache thông minh

User data được cache với thời gian hết hạn 24 giờ. Sau 24 giờ, cache sẽ tự động bị xóa và data sẽ được fetch lại từ server.

```typescript
// Cache duration (có thể thay đổi trong localStorage.ts)
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

### Data Validation

Tất cả user data đều được validate trước khi lưu:

```typescript
const isValidUser = (user: any): user is User => {
    return (
        user &&
        typeof user === 'object' &&
        typeof user.email === 'string' &&
        typeof user.firstName === 'string' &&
        typeof user.lastName === 'string'
    );
};
```

### Tự động đồng bộ

- **AppContext**: Tự động sync current user với localStorage khi state thay đổi
- **useCurrentUser**: Tự động refresh user khi mount nếu cache hết hạn
- **updateUser**: Tự động cập nhật current user nếu email trùng khớp

### Error Handling

Tất cả các operations đều có error handling và fallback:

```typescript
try {
    // Operation
} catch (error) {
    console.error('Error message', error);
    return fallbackValue;
}
```

## Best Practices

1. **Sử dụng hooks trong components**: Ưu tiên `useCurrentUser` cho components
2. **Sử dụng context cho app-wide state**: AppContext cho shared state
3. **Sử dụng utils cho server sync**: userStorage utilities cho API calls
4. **Logout đúng cách**: Luôn gọi `logoutUser()` hoặc `clearAllUserData()` khi logout
5. **Refresh khi cần**: Gọi `refreshUser()` sau khi update profile ở server

## Ví dụ thực tế

### Login Flow

```tsx
import { setCurrentUser } from '@/utils/localStorage';
import { getUserInfoByEmail } from '@/service/UserService';

async function handleLogin() {
    try {
        const response = await getUserInfoByEmail();
        if (response?.data) {
            setCurrentUser(response.data);
            // User đã được lưu vào localStorage và cache
        }
    } catch (error) {
        console.error('Login failed:', error);
    }
}
```

### Update Profile Flow

```tsx
import { updateUserAndSync } from '@/utils/userStorage';

async function handleUpdateProfile(updatedData: Partial<User>) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const updatedUser = { ...currentUser, ...updatedData };
    
    const success = await updateUserAndSync(updatedUser, {
        400: (error) => {
            console.error('Validation error:', error);
        },
        rest: (error) => {
            console.error('Server error:', error);
        }
    });

    if (success) {
        alert('Profile updated successfully!');
    }
}
```

### Logout Flow

```tsx
import { logoutUser } from '@/utils/userStorage';
import { keycloak } from '@/config/keycloak';

function handleLogout() {
    // Xóa tất cả user data
    logoutUser();
    
    // Logout khỏi Keycloak
    keycloak.logout();
}
```

## Troubleshooting

### User không được cache

Kiểm tra:
1. localStorage có bị disable không?
2. Cache expiry có bị set sai không?
3. Browser có đang ở chế độ incognito không?

### Data không sync với server

Kiểm tra:
1. API endpoint có đúng không?
2. Token authentication có valid không?
3. Network request có thành công không?

### Memory leaks trong hooks

Đảm bảo:
1. Cleanup effects đúng cách
2. Không call setState sau khi component unmount
3. Sử dụng useCallback cho functions

## Migration từ code cũ

Nếu bạn đang sử dụng code cũ, cần update:

```typescript
// Cũ
const user = getCurrentUser(); // Có thể return defaultUser

// Mới
const user = getCurrentUser(); // Return null nếu không có user
if (!user) {
    // Handle no user case
}
```

```typescript
// Cũ - AppContext
const { currentUser } = useApp(); // currentUser là User

// Mới - AppContext
const { currentUser } = useApp(); // currentUser là User | null
if (currentUser) {
    // Safe to use currentUser
}
```
