import axios from "axios";
import {useSearchParams} from "react-router";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import Swal from "sweetalert2";
import {LoginLoading} from "~/util/loading/loginLoading";

const host = "http://localhost:8080/api/v1";

export const getGoogleLoginLink = (): string => {
    const queryParams = new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URL || '',
        response_type: 'code',
        scope: 'email profile',
        access_type: 'offline',
        prompt: 'consent',
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${queryParams.toString()}`;
};

export const GoogleLoginHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
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
                    window.location.href = res.data.redirectUrl;
                } else {
                    navigate("/login");
                }
            })
            .catch(async (err) => {
                const res = err.response;
                if (res?.status === 403 && res?.data?.banned) {
                    await Swal.fire({
                        icon: "warning",
                        title: "접근 제한",
                        html: `<b>${res.data.banUntil}</b>까지 로그인할 수 없습니다.`,
                        confirmButtonText: "확인",
                        customClass: {
                            popup: "custom-popup",
                            title: "custom-title",
                            actions: "custom-actions",
                            confirmButton: "custom-confirm-button",
                        },
                    });
                    navigate("/main");
                } else {
                    console.error("SNS 로그인 실패", err);
                    navigate("/login");
                }
            })
            .finally(() => setIsLoading(false));
    }, [code, navigate]);

    if (isLoading) return <LoginLoading />;

    return null;
};