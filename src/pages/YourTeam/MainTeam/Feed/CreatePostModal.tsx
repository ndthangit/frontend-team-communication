import React, { useState } from "react";
import type { Post } from "../../../../types";
import { Send, X } from "lucide-react";
import { createPostAsync } from "../../../../service/PostService.ts";
import { useCurrentUser } from "../../../../hooks/useCurrentUser.tsx"; // Sử dụng hàm mới

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (newPost: Post) => void;
    teamId: string;
    channelId?: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    teamId,
    channelId,
}) => {
    const { currentUser } = useCurrentUser();
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    console.log(currentUser)

    const handleSubmit = async () => {
        if (!content.trim()) {
            setError("Nội dung không được để trống");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const newPost: Post = {
                id: `post-${Date.now()}`,
                groupId: teamId,
                channelId: channelId || undefined,
                content: content.trim(),
                likes: 0,
                comments: [], // Đảm bảo luôn có mảng rỗng
                author: currentUser, // Người đăng là currentUser
                createdAt: new Date() // Thêm thời gian tạo
            };

            // Sử dụng hàm mới, đơn giản hơn
            const response = await createPostAsync(newPost);

            // API có thể trả về string message hoặc Post object
            let createdPost: Post;
            if (typeof response === 'string') {
                // Nếu API trả về message string, sử dụng newPost đã tạo
                createdPost = newPost;
            } else {
                // Nếu API trả về Post object
                createdPost = response;

                // Đảm bảo post trả về có đầy đủ thông tin author
                if (!createdPost.author) {
                    createdPost.author = currentUser;
                }

                if (!createdPost.comments) {
                    createdPost.comments = [];
                }
            }

            if (onSuccess) {
                onSuccess(createdPost);
            }

            setContent('');
            onClose();
        } catch (err) {
            console.error("Lỗi khi tạo bài đăng:", err);
            setError("Đã có lỗi xảy ra khi tạo bài đăng. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setContent('');
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault(); // Ngăn xuống dòng
            handleSubmit();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl animate-fade-in">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900">Tạo bài đăng mới</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Luôn có currentUser nên không cần kiểm tra */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {currentUser!.firstName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-900">
                                {currentUser!.firstName} {currentUser!.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                                {channelId ? `Đăng trong kênh ${channelId}` : "Đăng trong team"}
                            </p>
                        </div>
                    </div>

                    <textarea
                        value={content}
                        onChange={(e) => {
                            setContent(e.target.value);
                            if (error) setError(null);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Bạn đang nghĩ gì?"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[180px] resize-none text-gray-900"
                        autoFocus
                        disabled={isSubmitting}
                        spellCheck={false}
                        data-gramm="false"
                    />

                    {error && (
                        <div className="mt-3 text-red-500 text-sm bg-red-50 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <div className="mt-2 text-xs text-gray-500">
                        Nhấn Ctrl + Enter (hoặc ⌘ + Enter trên Mac) để đăng nhanh
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!content.trim() || isSubmitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Đang đăng...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Đăng
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};