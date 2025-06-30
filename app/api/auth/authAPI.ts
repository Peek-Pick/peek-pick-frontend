import axios from "axios";
import axiosInstance from "~/instance/axiosInstance";
import axiosInstanceAdmin from "~/instance/axiosInstanceAdmin";

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
    await axiosInstance.post(`/auth/logout`, null, {
        withCredentials: true,
    });
};

export const refreshAccessToken = async () => {
    const res = await axios.get(`${host}/auth/refresh`, {
        withCredentials: true,
    });

    if (res.status !== 200) {
        throw new Error("Access token refresh failed");
    }
};

export const checkLoginAPI = async () => {
    const res = await axiosInstance.get(`${host}/auth/check`, {
        withCredentials: true, // ✅ 쿠키 전송
    });
    console.log("res.data: ",res.data)
    return res.data; // true 또는 false
};

// 어드민 로그인
export async function getAdminToken(aid: string, apw: string) {
    return await fetch(`${host}/admin/auth/login`, {
        method: "POST",
        credentials: "include", // 쿠키 포함 필수
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            aid: aid,
            apw: apw,
        }),
    }).then((res) => {
        if (!res.ok) throw new Error("로그인 실패");
    });
}

export const logoutAdmin = async () => {
    await axiosInstanceAdmin.post(`/auth/logout`, null, {
        withCredentials: true,
    });
};

export const refreshAccessTokenAdmin = async () => {
    const res = await axios.get(`${host}/admin/auth/refresh`, {
        withCredentials: true,
    });

    if (res.status !== 200) {
        throw new Error("Access token refresh failed");
    }
};

