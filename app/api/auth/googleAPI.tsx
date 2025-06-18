import axios from "axios"
import {useSearchParams} from "react-router";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const host = "http://localhost:8080/api/v1";

export const getGoogleLoginLink = (): string => {
    const queryParams = new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URL || '',
        response_type: 'code',
        scope: 'email profile',
        access_type: 'offline', // optional: refresh token을 원할 경우
        prompt: 'consent',      // optional: 로그인 매번 새로 하도록
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${queryParams.toString()}`;
};

export const GoogleLoginHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get("code");

    useEffect(() => {
        if (!code) {
            navigate("/login");
            return;
        }

        axios.get(`${host}/auth/login/google?code=${code}`, {
            withCredentials: true,
        })
            .then((res) => {
                if (res.status === 200 && res.data?.isNew) {
                    navigate("/signup/profile", { state: { email: res.data.email } });
                } else if (res.status === 200 && res.data?.redirectUrl) {
                    // 백엔드에서 리다이렉트 URL 응답 시 직접 이동
                    window.location.href = res.data.redirectUrl;
                } else {
                    navigate("/login");
                }
            })
            .catch((err) => {
                console.error("SNS 로그인 실패", err);
                navigate("/login");
            });
    }, [code, navigate]);

    return <div>로그인 처리 중입니다...</div>;
};