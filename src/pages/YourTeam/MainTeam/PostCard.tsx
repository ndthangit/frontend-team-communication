import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, MoreVertical } from 'lucide-react';
import type { Post, Comment } from "../../../types";
import { formatDate } from "../../../utils/userHelper.ts";
import { useCurrentUser } from "../../../hooks/useCurrentUser.tsx";
import { CommentSection } from "./CommentSection.tsx";
import { getCommentsByPostIdAsync } from "../../../service/PostService.ts";

interface PostCardProps {
    post: Post;
    onCommentAdded?: (postId: string, comment: Comment) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onCommentAdded }) => {
    const { currentUser } = useCurrentUser();
    const [isCommenting, setIsCommenting] = useState(false);
    const [localComments, setLocalComments] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [commentsLoaded, setCommentsLoaded] = useState(false);

    // Đếm số lượng comments trực tiếp (không bao gồm replies)
    const totalComments = localComments.length;

    // Kiểm tra post có tồn tại không
    if (!post) {
        return (
            <article className="bg-white rounded-lg border border-gray-200 p-6">
                <p className="text-gray-500">Bài đăng không tồn tại</p>
            </article>
        );
    }

    // Xử lý trường hợp author có thể là null
    const authorName = post.author
        ? `${post.author.firstName} ${post.author.lastName}`
        : 'Người dùng ẩn danh';

    const authorInitials = post.author
        ? `${post.author.firstName?.charAt(0) || ''}${post.author.lastName?.charAt(0) || ''}`.toUpperCase()
        : 'U';

    const handleCommentAddedLocal = (postId: string, comment: Comment) => {
        setLocalComments([...localComments, comment]);
        if (onCommentAdded) {
            onCommentAdded(postId, comment);
        }
    };

    const handleToggleComments = async () => {
        if (!isCommenting) {
            // Khi mở comment section, fetch comments nếu chưa load
            if (!commentsLoaded) {
                setIsLoadingComments(true);
                try {
                    const comments = await getCommentsByPostIdAsync(post.id);
                    setLocalComments(comments);
                    setCommentsLoaded(true);
                } catch (error) {
                    console.error('Lỗi khi tải bình luận:', error);
                } finally {
                    setIsLoadingComments(false);
                }
            }
        }
        setIsCommenting(!isCommenting);
    };

    return (
        <article className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-3 mb-4">
                {/* Avatar */}
                {post.author?.avatarUrl ? (
                    <img
                        src={post.author.avatarUrl}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {authorInitials}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-gray-900">{authorName}</h3>
                        {post.createdAt && (
                            <span className="text-xs text-gray-500">{formatDate(post.createdAt)}</span>
                        )}
                    </div>
                </div>

                <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Nội dung bài đăng */}
            <div className="mb-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{post.content || 'Nội dung trống'}</p>
            </div>

            {/* Footer với lượt thích và bình luận */}
            <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{(post.likes || 0) > 0 ? post.likes : ''}</span>
                    </button>
                    <button
                        onClick={handleToggleComments}
                        disabled={isLoadingComments}
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>{isLoadingComments ? 'Đang tải...' : (totalComments > 0 ? totalComments : '')}</span>
                    </button>
                </div>

                {/* Comment Section */}
                {isCommenting && (
                    <CommentSection
                        postId={post.id}
                        comments={localComments}
                        currentUser={currentUser}
                        onCommentAdded={handleCommentAddedLocal}
                        isLoading={isLoadingComments}
                    />
                )}
            </div>
        </article>
    );
};