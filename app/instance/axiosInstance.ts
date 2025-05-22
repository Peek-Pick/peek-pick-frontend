import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { refreshAccessToken } from "~/api/authAPI";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    withCredentials: true,
});

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            console.warn("💥 401 발생, access_token 만료 의심. refresh 시도 중...");
            originalRequest._retry = true;

            try {
                await refreshAccessToken();
                return axiosInstance(originalRequest); // 갱신 후 원래 요청 재시도
            } catch (refreshError) {
                console.error("자동 토큰 갱신 실패", refreshError);

                // 클라이언트 사이드에서만 리다이렉트 실행
                if (typeof window !== "undefined") {
                    console.warn("🚪 로그아웃 처리, 로그인 페이지로 이동");
                    window.location.href = "/auth/login";
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
