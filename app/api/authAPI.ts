import axios from "axios";
import axiosInstance from "~/instance/axiosInstance";

const host = "http://localhost:8080/api/v1";

// 일반 로그인
export async function getToken(email: string, password: string) {
    return await fetch(`${host}/auth/login`, {
        method: "POST",
        credentials: "include", // 쿠키 포함 필수
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            uem: email,
            upw: password,
        }),
    }).then((res) => {
        if (!res.ok) throw new Error("로그인 실패");
    });
}

export const logout = async () => {
    await axiosInstance.post(`${host}/auth/logout`, null, {
        withCredentials: true,
    });
};

export const refreshAccessToken = async () => {
    await axios.get(`${host}/auth/refresh`, {
        withCredentials: true,
    });
};