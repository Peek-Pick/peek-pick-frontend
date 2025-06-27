import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { refreshAccessToken } from "~/api/auth/authAPI";

// snake_case → camelCase 변환
const toCamel = (s: string) =>
    s.replace(/([-_][a-z])/g, group => group.toUpperCase().replace('-', '').replace('_', ''));

const isObject = (obj: any) =>
    obj === Object(obj) && !Array.isArray(obj) && typeof obj !== "function";

const keysToCamel = (obj: any): any => {
    if (isObject(obj)) {
        return Object.entries(obj).reduce((acc, [key, value]) => {
            acc[toCamel(key)] = keysToCamel(value);
            return acc;
        }, {} as any);
    } else if (Array.isArray(obj)) {
        return obj.map(i => keysToCamel(i));
    }
    return obj;
};

// Axios 인스턴스
const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
});

// 요청 실패 대기 큐
let refreshTokenPromise: Promise<void> | null = null;

const failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void;
    config: AxiosRequestConfig;
}[] = [];

// 큐 처리
const processQueue = (error: AxiosError | null) => {
    failedQueue.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
        } else {
            resolve(instance(config));
        }
    });
    failedQueue.length = 0;
};

// 응답 인터셉터
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
                refreshTokenPromise = refreshAccessToken()
                    .then(() => processQueue(null))
                    .catch((err) => {
                        processQueue(err);
                        if (typeof window !== "undefined") {
                            window.location.href = "/login";
                        }
                    })
                    .finally(() => {
                        refreshTokenPromise = null;
                    });
            }

            try {
                await refreshTokenPromise;
                return instance(originalRequest);
            } catch (err) {
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
