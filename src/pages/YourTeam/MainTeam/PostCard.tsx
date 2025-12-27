import React from 'react';
import { ThumbsUp, MessageSquare, MoreVertical } from 'lucide-react';
import type {Post} from "../../../types";
import {formatDate} from "../../../utils/userHelper.ts";

interface PostCardProps {
    post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
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

    // Đảm bảo comments luôn là mảng
    const comments = post.comments || [];

    const getCommentAuthorInfo = (comment: any) => {
        if (!comment?.author) {
            return { name: 'Người dùng ẩn danh', initials: 'U' };
        }
        return {
            name: `${comment.author.firstName || ''} ${comment.author.lastName || ''}`.trim(),
            initials: `${comment.author.firstName?.charAt(0) || ''}${comment.author.lastName?.charAt(0) || ''}`.toUpperCase()
        };
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
                    <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                        <MessageSquare className="w-4 h-4" />
                        <span>{comments.length > 0 ? comments.length : ''}</span>
                    </button>
                </div>

                {/* Danh sách bình luận */}
                {comments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        {comments.map((comment) => {
                            const commentAuthor = getCommentAuthorInfo(comment);

                            return (
                                <div key={comment.id} className="flex items-start gap-3">
                                    {comment.author?.avatarUrl ? (
                                        <img
                                            src={comment.author.avatarUrl}
                                            alt={commentAuthor.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
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
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-700">{comment.content || ''}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </article>
    );
};