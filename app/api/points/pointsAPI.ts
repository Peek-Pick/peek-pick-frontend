import axios from "axios";
import axiosInstance from "~/instance/axiosInstance";
import type {PointStoreDTO} from "~/types/points";


// 쿠폰 단건 조회
export async function readCoupon(pointstoreId: number | null): Promise<PointStoreDTO> {
    const response = await axiosInstance.get(`/admin/points/${pointstoreId}`);
    return response.data;
}

// 쿠폰 목록 조회 (관리자용)
export async function listCoupon(page: number, size: number, sort:string, type?: string) {
    const params: any = { page, size, sort, type };
    if (type && type !== "ALL") {
        params.type = type;
    }

    const response = await axiosInstance.get(`/admin/points`, { params });

    return response.data;
}


// 쿠폰 추가 (FormData 사용, @ModelAttribute 기준)
export async function addCoupon(data: FormData): Promise<number> {
    const response = await axiosInstance.post(`/admin/points`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data; // 생성된 ID
}

// 쿠폰 수정
export async function updateCoupon(pointstoreId: number, data: FormData): Promise<void> {
    await axiosInstance.put(`/admin/points/${pointstoreId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

// 쿠폰 삭제 (soft-delete)
export async function deleteCoupon(pointstoreId: number): Promise<void> {
    await axiosInstance.patch(`/admin/points/${pointstoreId}`);
}
//--------------------
// 쿠폰 구매
export async function redeemCoupon(pointstoreId: number): Promise<void> {
    await axiosInstance.patch(`/points/redeem/${pointstoreId}`);
}

// 사용자 쿠폰함 - 쿠폰 목록 조회
export async function userCouponList(page: number, size: number, sort: string, status?: string) {
    const params: any = { page, size, sort, status };
    if (status && status !== "ALL") {
        params.status = status;
    }
    const response = await axiosInstance.get(`/users/mypage/coupons`, { params });

    return response.data;
}



//사용자 포인트 내역 조회
export async function userPointLogs(page: number, size: number, sort:string) {
    const response = await axiosInstance.get(`/users/mypage/points/history`, {
        params: { page, size, sort },
    });
    
    return response.data;
}

