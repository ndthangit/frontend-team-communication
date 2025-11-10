import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import {keycloak} from "./config/keycloak.tsx";

// Định nghĩa các kiểu TypeScript
export interface ErrorHandlers {
    [status: number]: (error: AxiosError) => void;
    rest?: (error: AxiosError) => void;
    noResponse?: (error: AxiosError) => void;
}

interface RequestConfig extends AxiosRequestConfig {
    headers?: Record<string, string>;
}

// Kiểm tra xem một biến có phải là hàm không
export const isFunction = (func: unknown): func is (...args: unknown[]) => unknown =>
    typeof func === "function";

// Tạo instance axios với cấu hình cơ bản
const axiosInstance = axios.create({
    baseURL: "http://localhost:8080",
    headers: { "Content-Type": "application/json" },
});

// Tạo header Bearer Authentication
export const bearerAuth = (token: string | undefined): string => `Bearer ${token}`;

// Xử lý lỗi 401 (Unauthorized)
const handleUnauthorized = (): void => {
    keycloak.login({
        redirectUri: window.location.origin + window.location.pathname,
    });
};

// Xử lý lỗi 403 (Forbidden)
const handleForbidden = (errorHandlers: ErrorHandlers | undefined, error: AxiosError): void => {
    if (isFunction(errorHandlers?.[403])) {
        errorHandlers[403](error);
    } else {
        console.error("Bạn cần được cấp quyền để thực hiện hành động này.");
    }
};

// Xử lý lỗi yêu cầu
const handleRequestError = (error: AxiosError, errorHandlers?: ErrorHandlers): void => {
    console.error("Request error:", error);

    if (error.response) {
        const { status } = error.response;

        if (status === 401) {
            return handleUnauthorized();
        }
        if (status === 403) {
            return handleForbidden(errorHandlers, error);
        }

        if (status === 410 || status === 500) {
            console.error(`Lỗi server: ${status}. Vui lòng thử lại sau.`);
            throw error;
        }

        if (isFunction(errorHandlers?.[status])) {
            errorHandlers[status](error);
        } else if (isFunction(errorHandlers?.rest)) {
            errorHandlers.rest(error);
        } else {
            console.error(`Lỗi ${status}: ${error.message}`);
        }
    } else if (error.request) {
        if (isFunction(errorHandlers?.noResponse)) {
            errorHandlers.noResponse(error);
        }
        console.error("Không thể kết nối tới server. Vui lòng kiểm tra mạng!");
    } else {
        console.error("Request setup error:", error.message);
    }
};

// Hàm request chính
export async function request<T = never>(
    method: string,
    url: string,
    successHandler?: (response: AxiosResponse<T>) => void,
    errorHandlers?: ErrorHandlers,
    data?: T,
    config: RequestConfig = {},
    controller?: AbortController
): Promise<AxiosResponse<T> | void> {
    // Kiểm tra xác thực Keycloak
    if (!keycloak.authenticated) {
        console.warn("Bạn chưa đăng nhập. Đang chuyển hướng...");
        await keycloak.login({
            redirectUri: window.location.origin + window.location.pathname,
        });
        return;
    }

    // Làm mới token Keycloak
    try {
        await keycloak.updateToken(70);
    } catch (error) {
        console.error("Failed to refresh token:", error);
        return handleUnauthorized();
    }

    // Đảm bảo config là object hợp lệ
    const safeConfig: RequestConfig = config || {};

    // Thiết lập headers
    const headers: Record<string, string> = {
        authorization: bearerAuth(keycloak.token),
        ...(safeConfig.headers || {}),
    };

    if (safeConfig.headers?.["Content-Type"] === "multipart/form-data") {
        headers["Content-Type"] = "multipart/form-data";
    }

    const options: AxiosRequestConfig = {
        method: method.toLowerCase(),
        url,
        data,
        ...safeConfig,
        headers,
        signal: controller?.signal,
    };

    try {
        const res: AxiosResponse<T> = await axiosInstance.request(options);
        if (isFunction(successHandler)) {
            successHandler(res);
        }
        return res;
    } catch (error) {
        handleRequestError(error as AxiosError, errorHandlers);
    }
}

// API Functions

/**
 * Lấy danh sách teams của user theo email
 */


/**
 * Tạo team mới
 */
export async function createTeam(
    teamData: any,
    successHandler?: (response: AxiosResponse<any>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<any> | void> {
    return request(
        'POST',
        '/api/teams',
        successHandler,
        errorHandlers,
        teamData
    );
}

/**
 * Lấy thông tin chi tiết một team
 */
export async function getTeamById(
    teamId: string,
    successHandler?: (response: AxiosResponse<any>) => void,
    errorHandlers?: ErrorHandlers
): Promise<AxiosResponse<any> | void> {
    return request(
        'GET',
        `/api/teams/${teamId}`,
        successHandler,
        errorHandlers
    );
}

