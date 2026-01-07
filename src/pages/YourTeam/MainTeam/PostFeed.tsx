import React, { useEffect, useState } from 'react';
import { PenSquare } from 'lucide-react';
import { PostCard } from './PostCard';
import type { Post, Comment } from "../../../types";
import { CreatePostModal } from "./Feed/CreatePostModal.tsx";
import { getPostsAsync } from "../../../service/PostService.ts"; // Sử dụng hàm mới

interface PostFeedProps {
    teamId: string;
    channelId?: string;
}

export const PostFeed: React.FC<PostFeedProps> = ({ teamId, channelId }) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // Sử dụng hàm mới
                const fetchedPosts = await getPostsAsync(teamId);
                console.log("Posts fetched:", fetchedPosts);
                setPosts(fetchedPosts || []);
            } catch (error) {
                console.error("Lỗi khi lấy bài đăng:", error);
                setPosts([]); // Đặt mảng rỗng nếu có lỗi
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [teamId]);

    // Thêm bài post mới vào danh sách
    const handleAddNewPost = (newPost: Post) => {
        // Đảm bảo post mới có đầy đủ thông tin
        const enhancedPost: Post = {
            ...newPost,
            comments: newPost.comments || [], // Đảm bảo có mảng comments
            likes: newPost.likes || 0,
            createdAt: newPost.createdAt || new Date()
        };

        setPosts(prevPosts => [enhancedPost, ...prevPosts]);
    };

    // Xử lý khi comment được thêm
    const handleCommentAdded = (postId: string, comment: Comment) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, comments: [...(post.comments || []), comment] }
                    : post
            )
        );
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto py-6 px-6">
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="w-full mb-6 px-4 py-3 bg-white border border-gray-300 rounded-lg text-left text-gray-500 hover:bg-gray-50 flex items-center gap-2"
                >
                    <PenSquare className="w-5 h-5" />
                    <span>Đăng trong kênh</span>
                </button>

                {loading && (
                    <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Đang tải bài đăng...</p>
                    </div>
                )}

                <div className="space-y-4">
                    {posts.length === 0 && !loading ? (
                        <div className="text-center py-8 text-gray-500">
                            Chưa có bài đăng nào. Hãy bắt đầu cuộc trò chuyện!
                        </div>
                    ) : (
                        posts.map((post) => {
                            // Đảm bảo post có đầy đủ thông tin trước khi render
                            const safePost: Post = {
                                ...post,
                                comments: post.comments || [],
                                likes: post.likes || 0,
                                author: post.author || null
                            };
                            return (
                                <PostCard
                                    key={post.id}
                                    post={safePost}
                                    onCommentAdded={handleCommentAdded}
                                />
                            );
                        })
                    )}
                </div>

                <CreatePostModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleAddNewPost}
                    teamId={teamId}
                    channelId={channelId}
                />
            </div>
        </div>
    );
};