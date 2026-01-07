import type { AxiosResponse } from "axios";
import { type ErrorHandlers, request } from "../api.tsx";
import type { Post, Comment } from "../types";

export async function createPost(
    post: Post,
    successHandler?: (response: AxiosResponse<Post>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<Post> | void> {
    return request(
        'POST',
        `/media-service/post-events/create`,
        successHandler,
        errorHandlers,
        post
    );
}

export async function getPost(
    groupId: string,
    successHandler?: (response: AxiosResponse<Post[]>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<Post[]> | void> {
    return request(
        'GET',
        `/media-service/post/group/${groupId}`,
        successHandler,
        errorHandlers
    );
}

export async function createPostAsync(post: Post): Promise<Post | string> {
    return new Promise((resolve, reject) => {
        createPost(
            post,
            (response) => {
                resolve(response.data);
            },
            {
                401: (error) => reject(error),
                403: (error) => reject(error),
                500: (error) => reject(error),
                rest: (error) => reject(error),
                noResponse: (error) => reject(error)
            }
        );
    });
}

// Hàm lấy posts trả về mảng Post
export async function getPostsAsync(groupId: string): Promise<Post[]> {
    return new Promise((resolve, reject) => {
        getPost(
            groupId,
            (response) => {
                // Đảm bảo mỗi post đều có comments
                const postsWithComments = response.data.map(post => ({
                    ...post,
                    comments: post.comments || [] // Thêm mảng rỗng nếu không có comments
                }));
                resolve(postsWithComments);
            },
            {
                401: (error) => reject(error),
                403: (error) => reject(error),
                500: (error) => reject(error),
                rest: (error) => reject(error),
                noResponse: (error) => reject(error)
            }
        );
    });
}

// API lấy comments của một post (chỉ lấy comments trực tiếp, không lấy replies)
export async function getCommentsByPostId(
    postId: string,
    successHandler?: (response: AxiosResponse<Comment[]>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<Comment[]> | void> {
    return request(
        'GET',
        `/media-service/comment/post/${postId}`,
        successHandler,
        errorHandlers
    );
}

// API lấy replies của một comment
export async function getRepliesByCommentId(
    commentId: string,
    successHandler?: (response: AxiosResponse<Comment[]>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<Comment[]> | void> {
    return request(
        'GET',
        `/media-service/comment/replies/${commentId}`,
        successHandler,
        errorHandlers
    );
}

// Hàm async để lấy comments (chỉ lấy comments trực tiếp của post)
export async function getCommentsByPostIdAsync(postId: string): Promise<Comment[]> {
    return new Promise((resolve, reject) => {
        getCommentsByPostId(
            postId,
            (response) => {
                resolve(response.data || []);
            },
            {
                401: (error) => reject(error),
                403: (error) => reject(error),
                500: (error) => reject(error),
                rest: (error) => reject(error),
                noResponse: (error) => reject(error)
            }
        );
    });
}

// Hàm async để lấy replies của một comment
export async function getRepliesByCommentIdAsync(commentId: string): Promise<Comment[]> {
    return new Promise((resolve, reject) => {
        getRepliesByCommentId(
            commentId,
            (response) => {
                resolve(response.data || []);
            },
            {
                401: (error) => reject(error),
                403: (error) => reject(error),
                500: (error) => reject(error),
                rest: (error) => reject(error),
                noResponse: (error) => reject(error)
            }
        );
    });
}

// API tạo comment cho post
export async function createComment(
    comment: Partial<Comment>,
    successHandler?: (response: AxiosResponse<Partial<Comment>>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<Partial<Comment>> | void> {
    return request(
        'POST',
        `/media-service/comment-events/create/comment`,
        successHandler,
        errorHandlers,
        comment
    );
}

// API tạo reply cho comment
export async function createReplyComment(
    comment: Partial<Comment>,
    successHandler?: (response: AxiosResponse<Partial<Comment>>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<Partial<Comment>> | void> {
    return request(
        'POST',
        `/media-service/comment-events/create/reply`,
        successHandler,
        errorHandlers,
        comment
    );
}