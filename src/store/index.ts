import { configureStore } from '@reduxjs/toolkit';
import teamReducer from './slices/teamSlice';
import postReducer from './slices/postSlice';
import conversationReducer from './slices/conversationSlice';
import fileReducer from './slices/fileSlice';
import callReducer from './slices/callSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
    reducer: {
        team: teamReducer,
        post: postReducer,
        conversation: conversationReducer,
        file: fileReducer,
        call: callReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['post/addPost', 'post/addComment', 'conversation/addMessage'],
                ignoredPaths: [
                    'post.posts',
                    'conversation.messages',
                    'conversation.conversations',
                ],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
