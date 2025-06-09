import axiosInstance from "~/instance/axiosInstance";
import type Long from "@zxing/library/es2015/core/util/Long";
import type {UpdateStatus} from "~/types/users";

const host = "http://localhost:8080/api/v1/admin/users";

// 사용자 목록 조회
export async function getUserList(page: number, size: number) {
    const res = await axiosInstance.get(`${host}/list?page=${page}&size=${size}`)
    return res.data
}

// 사용자 디테일 조회
export async function getUserDetail( userId:Long) {
    const res = await axiosInstance.get(`${host}/${userId}`)
    return res.data
}

// 사용자별 리뷰 조회
export const getAdminUserReviews = async (userId: number, page: number) => {
    const params = new URLSearchParams({
        page: String(page),
        userId: String(userId),
    });
    return await axiosInstance.get(`${host}?${params.toString()}`);
}

// 사용자별 리뷰 개수 조회
export const getAdminUserReviewsCount = async (userId: number): Promise<number> => {
    const response = await axiosInstance.get(`${host}/count?userId=${userId}`);
    return response.data;
};

// 사용자 상태 수정
export const updateAdminUserStatus = async (userId: number, payload: UpdateStatus) => {
    const response = await axiosInstance.patch(`${host}/${userId}/status`, payload)
    return response.data
}