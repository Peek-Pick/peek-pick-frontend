import axios from "axios"

const host = 'http://localhost:8080/api/v1/auth/login/google'
const access_token_url = 'https://oauth2.googleapis.com/token'

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

//access token 얻기
export const getAccessToken = async (authCode: string) => {
    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    };

    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URL || '',
        code: authCode,
    });

    try {
        const res = await axios.post(access_token_url, params.toString(), { headers });
        const accessToken = res.data.access_token;
        return accessToken;
    } catch (error) {
        console.error('Failed to get access token:', error);
        throw error;
    }
};

export const getMemberWithAccessToken = async(accessToken:string) => {

    const res = await axios.get(`${host}?accessToken=${accessToken}`)
    console.log(res.data)

    return res.data
}