import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "~/api/authAPI";

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

instance.interceptors.response.use(
    res => res,
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
                            processQueue(null); // 모든 요청 다시 시도
                        })
                        .catch(err => {
                            isRefreshing = false;
                            processQueue(err); // 모든 요청 실패 처리
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
