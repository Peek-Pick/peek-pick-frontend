import axios from "axios"

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