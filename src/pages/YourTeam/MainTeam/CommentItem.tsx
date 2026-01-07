import React, { useState } from 'react';
import type { Comment, User } from "../../../types";
import { formatDate } from "../../../utils/userHelper.ts";
import { getRepliesByCommentIdAsync } from "../../../service/PostService.ts";

interface CommentItemProps {
    comment: Comment;
    currentUser?: User | null;
    onReply?: (parentId: string, content: string) => void;
    depth?: number;
}

export const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    currentUser,
    onReply,
    depth = 0
}) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<Comment[]>([]);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [repliesLoaded, setRepliesLoaded] = useState(false);

    const getCommentAuthorInfo = () => {
        if (!comment?.author) {
            return { name: 'Người dùng ẩn danh', initials: 'U' };
        }
        return {
            name: `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim(),
            initials: `${comment.author.firstName?.charAt(0) || ''}${comment.author.lastName?.charAt(0) || ''}`.toUpperCase()
        };
    };

    const commentAuthor = getCommentAuthorInfo();

    const handleReplySubmit = () => {
        if (!replyContent.trim() || !onReply) return;
        onReply(comment.id, replyContent.trim());
        setReplyContent('');
        setIsReplying(false);
        // Reset replies để reload lại sau khi thêm reply mới
        setRepliesLoaded(false);
        if (showReplies) {
            loadReplies();
        }
    };

    const loadReplies = async () => {
        if (loadingReplies || repliesLoaded) return;

        setLoadingReplies(true);
        try {
            const fetchedReplies = await getRepliesByCommentIdAsync(comment.id);
            setReplies(fetchedReplies);
            setRepliesLoaded(true);
        } catch (error) {
            console.error('Lỗi khi tải replies:', error);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleToggleReplies = async () => {
        if (!showReplies && !repliesLoaded) {
            await loadReplies();
        }
        setShowReplies(!showReplies);
    };

    // Format createdAt - handle both timestamp (number) and Date
    const formatCreatedAt = () => {
        if (!comment.createdAt) return '';
        if (typeof comment.createdAt === 'number') {
            return formatDate(new Date(comment.createdAt));
        }
        return formatDate(comment.createdAt);
    };

    // Max depth for nested replies
    const maxDepth = 3;
    const canReply = depth < maxDepth;

    return (
        <div className={`flex flex-col ${depth > 0 ? 'ml-8 mt-3' : ''}`}>
            <div className="flex items-start gap-3">
                {comment.author?.avatarUrl ? (
                    <img
                        src={comment.author.avatarUrl}
                        alt={commentAuthor.name}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                        {commentAuthor.initials}
                    </div>
                )}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm text-gray-900">
                            {commentAuthor.name}
                        </span>
                        {comment.createdAt && (
                            <span className="text-xs text-gray-500">
                                {formatCreatedAt()}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-700">{comment.content || ''}</p>

                    {/* Reply button and Show/Hide replies button */}
                    <div className="flex items-center gap-3 mt-1">
                        {currentUser && canReply && (
                            <button
                                onClick={() => setIsReplying(!isReplying)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Trả lời
                            </button>
                        )}

                        {/* Hiển thị button để xem replies */}
                        {depth < maxDepth && (
                            <button
                                onClick={handleToggleReplies}
                                disabled={loadingReplies}
                                className="text-xs text-gray-600 hover:text-gray-700 font-medium disabled:opacity-50"
                            >
                                {loadingReplies
                                    ? 'Đang tải...'
                                    : showReplies
                                        ? `Ẩn replies${repliesLoaded && replies.length > 0 ? ` (${replies.length})` : ''}`
                                        : `Xem replies${repliesLoaded && replies.length > 0 ? ` (${replies.length})` : ''}`
                                }
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Reply input */}
            {isReplying && (
                <div className="ml-11 mt-2">
                    <div className="flex items-start gap-2">
                        {currentUser?.avatarUrl ? (
                            <img
                                src={currentUser.avatarUrl}
                                alt={`${currentUser.firstName} ${currentUser.lastName}`}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                                {currentUser ? `${currentUser.firstName?.charAt(0) || ''}${currentUser.lastName?.charAt(0) || ''}`.toUpperCase() : 'U'}
                            </div>
                        )}
                        <div className="flex-1">
                            <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Viết trả lời..."
                                className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                                rows={2}
                                autoFocus
                            />
                            <div className="flex items-center gap-2 mt-1">
                                <button
                                    onClick={() => {
                                        setIsReplying(false);
                                        setReplyContent('');
                                    }}
                                    className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleReplySubmit}
                                    disabled={!replyContent.trim()}
                                    className="px-2 py-1 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Render nested replies - chỉ hiển thị khi showReplies = true */}
            {showReplies && replies.length > 0 && (
                <div className="mt-2">
                    {replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            currentUser={currentUser}
                            onReply={onReply}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
