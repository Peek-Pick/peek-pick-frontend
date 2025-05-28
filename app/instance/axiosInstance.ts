import axios, { type AxiosRequestConfig, type AxiosError } from "axios";
import { refreshAccessToken } from "~/api/authAPI";

const instance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
});

let isRefreshing = false;
let requestQueue: ((config: AxiosRequestConfig) => void)[] = [];

instance.interceptors.response.use(
    res => res,
    async (error: AxiosError) => {
        const original = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await refreshAccessToken();
                    isRefreshing = false;
                    // 대기 중인 요청들 재시도
                    requestQueue.forEach(cb => cb(original));
                    requestQueue = [];
                } catch {
                    // refresh 실패 시 로그아웃 로직
                    if (typeof window !== "undefined") window.location.href = "/login";
                }
            }

            // 새로고침 중에는 요청을 큐에 추가
            return new Promise(resolve => {
                requestQueue.push((cfg) => resolve(instance(cfg)));
            });
        }

        return Promise.reject(error);
    }
);

export default instance;
