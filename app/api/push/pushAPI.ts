import axiosInstance from '~/instance/axiosInstance';

export const getFCMToken = async (token: string) =>
    await axiosInstance.post("/push/fcm", { token });

export const getFCMTokenValidity = async (token: string): Promise<boolean> => {
    try {
        const res = await axiosInstance.post("/push/fcm/validate", { token });
        return res.data.valid === true;
    } catch (e) {
        console.error("[FCM] 토큰 유효성 확인 오류:", e);
        return false;
    }
};