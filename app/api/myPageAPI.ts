import axiosInstance from "~/instance/axiosInstance";

const host = "http://localhost:8080/api/v1/users";

export interface QuickStats {
    wishlistedCount: number;
    reviewCount: number;
    couponCount: number;
    barcodeHistoryCount: number;
}

export interface MyPageResponse {
    profileImgUrl: string;
    nickname: string;
    point: number;
    quickStats: QuickStats;
}

export const fetchUserProfile = async (): Promise<MyPageResponse> => {
    const response = await axiosInstance.get(`${host}/mypage`, { withCredentials: true });
    return response.data;
};