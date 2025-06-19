import axiosInstanceAdmin from "~/instance/axiosInstanceAdmin";
import type Long from "@zxing/library/es2015/core/util/Long";
import type {UpdateStatus} from "~/types/users";

const host = "http://localhost:8080/api/v1/admin/users";

// 사용자 목록 조회
export async function getUserList(page: number, category?: string, keyword?: string, status?: string, social?: boolean) {
    const params: Record<string, string> = {
        page: String(page),
        sort: "userId,desc"
    }

    if (category) params.category = category;
    if (keyword) params.keyword = keyword;
    if (status) params.status = status;
    if (social !== undefined) params.social = String(social);

    const response = await axiosInstanceAdmin.get(`${host}/list`, {params});
    return response.data;
}

// 사용자 디테일 조회
export async function getUserDetail( userId:Long) {
    const res = await axiosInstanceAdmin.get(`${host}/${userId}`)
    return res.data
}

// 사용자별 리뷰 조회
export const getAdminUserReviews = async (userId: number, page: number) => {
    const params = new URLSearchParams({
        page: String(page),
        userId: String(userId),
    });
    return await axiosInstanceAdmin.get(`${host}?${params.toString()}`);
}

// 사용자별 리뷰 개수 조회
export const getAdminUserReviewsCount = async (userId: number): Promise<number> => {
    const response = await axiosInstanceAdmin.get(`${host}/count?userId=${userId}`);
    return response.data;
};

// 사용자 상태 수정
export const updateAdminUserStatus = async (userId: number, payload: UpdateStatus) => {
    const response = await axiosInstanceAdmin.patch(`${host}/${userId}/status`, payload)
    return response.data
}