import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "~/api/authAPI";

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

// axios 인스턴스 생성
const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
});

let isRefreshing = false;
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
            resolve(instance(config));
        }
    });
    failedQueue = [];
};

// 응답 인터셉터 추가
instance.interceptors.response.use(
    response => {
        if (response.data) {
            response.data = keysToCamel(response.data);
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject, config: originalRequest });

                if (!isRefreshing) {
                    isRefreshing = true;

                    refreshAccessToken()
                        .then(() => {
                            isRefreshing = false;
                            processQueue(null);
                        })
                        .catch(err => {
                            isRefreshing = false;
                            processQueue(err);
                            if (typeof window !== "undefined") {
                                window.location.href = "/login";
                            }
                        });
                }
            });
        }

        return Promise.reject(error);
    }
);

export default instance;