import type { AxiosResponse } from "axios";
import { type ErrorHandlers, request } from "../api.tsx";
import type { Post } from "../types";

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