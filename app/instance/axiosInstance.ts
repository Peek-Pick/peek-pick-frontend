import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { refreshAccessToken } from "~/api/auth/authAPI";

// snake_case → camelCase 유틸
const toCamel = (s: string) =>
    s.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));

const isObject = (obj: any) => obj === Object(obj) && !Array.isArray(obj) && typeof obj !== "function";

const keysToCamel = (obj: any): any => {
    if (isObject(obj)) {
        const n: any = {};
        Object.keys(obj).forEach(k => {
            n[toCamel(k)] = keysToCamel(obj[k]);
        });
        return n;
    } else if (Array.isArray(obj)) {
        return obj.map(i => keysToCamel(i));
    }
    return obj;
};

const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
});

// 요청 대기 큐
let isRefreshing = false;
let refreshTokenPromise: Promise<void> | null = null;

let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void;
    config: AxiosRequestConfig;
}[] = [];

const processQueue = (error: AxiosError | null) => {
    failedQueue.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
        } else {
            // instance를 통해 재요청하여 interceptor 재적용
            resolve(instance(config));
        }
    });
    failedQueue = [];
};

instance.interceptors.response.use(
    (response: AxiosResponse) => {
        if (response.data) {
            response.data = keysToCamel(response.data);
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!refreshTokenPromise) {
                isRefreshing = true;
                refreshTokenPromise = refreshAccessToken()
                    .then(() => {
                        processQueue(null);
                    })
                    .catch(err => {
                        processQueue(err);
                        if (typeof window !== "undefined") {
                            window.location.href = "/login";
                        }
                    })
                    .finally(() => {
                        isRefreshing = false;
                        refreshTokenPromise = null;
                    });
            }

            try {
                await refreshTokenPromise; // ✅ 토큰 갱신 완료까지 기다림
                return instance(originalRequest); // ✅ 재요청
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;