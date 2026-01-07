import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import type { Comment, User } from "../../../types";
import { CommentItem } from "./CommentItem.tsx";
import { createComment, createReplyComment } from "../../../service/PostService.ts";

interface CommentSectionProps {
    postId: string;
    comments: Comment[];
    currentUser: User | null;
    onCommentAdded?: (postId: string, comment: Comment) => void;
    isLoading?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
    postId,
    comments: initialComments,
    currentUser,
    onCommentAdded,
    isLoading = false
}) => {
    const [commentContent, setCommentContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [localComments, setLocalComments] = useState<Comment[]>([]);

    // Update local comments when initial comments change
    // Không cần build tree nữa, chỉ lấy comments trực tiếp
    useEffect(() => {
        setLocalComments(initialComments);
    }, [initialComments]);

    const handleCommentSubmit = async () => {
        if (!commentContent.trim() || !currentUser) return;

        setIsSubmitting(true);
        try {
            const newComment: Partial<Comment> = {
                id: `comment-${Date.now()}`,
                postId: postId,
                parentId: null,  // Top-level comment
                content: commentContent.trim(),
                author: currentUser,
                createdAt: Date.now()
            };

            console.log("newComment", newComment);

            const response = await createComment(newComment);

            // Handle response
            let createdComment: Comment;
            if (!response || typeof response === 'string') {
                // If API returns string or void, create comment object
                createdComment = {
                    id: `comment-${Date.now()}`,
                    postId: postId,
                    parentId: null,
                    author: currentUser,
                    content: commentContent.trim(),
                    createdAt: Date.now(),
                    replies: []
                };
            } else if (response.data) {
                createdComment = {
                    id: response.data.id || `comment-${Date.now()}`,
                    postId: response.data.postId || postId,
                    parentId: response.data.parentId || null,
                    content: response.data.content || commentContent.trim(),
                    createdAt: response.data.createdAt || Date.now(),
                    author: response.data.author || currentUser,
                    eventType: response.data.eventType,
                    replies: []
                };
            } else {
                // Fallback
                createdComment = {
                    id: `comment-${Date.now()}`,
                    postId: postId,
                    parentId: null,
                    author: currentUser,
                    content: commentContent.trim(),
                    createdAt: Date.now(),
                    replies: []
                };
            }

            // Update local comments
            setLocalComments([...localComments, createdComment]);



            // Call callback if provided
            if (onCommentAdded) {
                onCommentAdded(postId, createdComment);
            }

            setCommentContent('');
        } catch (error) {
            console.error('Lỗi khi tạo comment:', error);
            alert('Có lỗi xảy ra khi đăng bình luận. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        if (!currentUser) return;

        try {
            const newReply: Partial<Comment> = {
                postId: null,  // Reply to comment, not post
                parentId: parentId,
                content: content,
                author: currentUser,
                createdAt: Date.now()
            };

            const response = await createReplyComment(newReply);

            // Handle response
            let createdReply: Comment;
            if (!response || typeof response === 'string') {
                createdReply = {
                    id: `reply-${Date.now()}`,
                    postId: null,
                    parentId: parentId,
                    author: currentUser,
                    content: content,
                    createdAt: Date.now(),
                    replies: []
                };
            } else if (response.data) {
                createdReply = {
                    id: response.data.id || `reply-${Date.now()}`,
                    postId: response.data.postId || null,
                    parentId: response.data.parentId || parentId,
                    content: response.data.content || content,
                    createdAt: response.data.createdAt || Date.now(),
                    author: response.data.author || currentUser,
                    eventType: response.data.eventType,
                    replies: []
                };
            } else {
                // Fallback
                createdReply = {
                    id: `reply-${Date.now()}`,
                    postId: null,
                    parentId: parentId,
                    author: currentUser,
                    content: content,
                    createdAt: Date.now(),
                    replies: []
                };
            }

            // Notify parent component - reply đã được tạo
            // Không cần thêm vào localComments vì reply sẽ được load on-demand
            if (onCommentAdded) {
                onCommentAdded(postId, createdReply);
            }
        } catch (error) {
            console.error('Lỗi khi tạo reply:', error);
            alert('Có lỗi xảy ra khi trả lời bình luận. Vui lòng thử lại.');
        }
    };

    return (
        <>
            {/* Loading state */}
            {isLoading && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
            )}

            {/* Danh sách bình luận */}
            {!isLoading && localComments.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {localComments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUser={currentUser}
                            onReply={handleReply}
                            depth={0}
                        />
                    ))}
                </div>
            )}

            {/* Form nhập comment - Luôn hiển thị ở dưới cùng */}
            {!isLoading && currentUser && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                        {/* Avatar người dùng hiện tại */}
                        {currentUser?.avatarUrl ? (
                            <img
                                src={currentUser.avatarUrl}
                                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {currentUser ? `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}`.toUpperCase() : 'U'}
                            </div>
                        )}

                        {/* Input comment */}
                        <div className="flex-1">
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Viết bình luận..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none text-sm"
                                rows={2}
                                disabled={isSubmitting}
                            />
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <button
                                    onClick={handleCommentSubmit}
                                    disabled={!commentContent.trim() || isSubmitting}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-3 h-3" />
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
