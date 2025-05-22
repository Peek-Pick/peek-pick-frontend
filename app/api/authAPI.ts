import axios from "axios";

const host = "http://localhost:8080/api/v1";

export const getToken = async (mem: string, mpw: string): Promise<{ accessToken: string; refreshToken: string }> => {
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
    };

    const params = new URLSearchParams();
    params.append("uem", mem);
    params.append("upw", mpw);

    const res = await axios.post(`${host}/auth/login`, params, {
        headers,
        withCredentials: true, // 쿠키도 함께 전송
    });

    // 서버 응답에서 accessToken, refreshToken을 추출
    const { accessToken, refreshToken } = res.data;

    return { accessToken, refreshToken };
};

export const refreshAccessToken = async () => {
    await axios.get(`${host}/auth/refresh`, {
        withCredentials: true, // 쿠키 포함
    });
};