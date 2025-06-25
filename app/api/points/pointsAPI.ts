
import axiosInstance from "~/instance/axiosInstance";
import type {PointStoreDTO} from "~/types/points";


// 쿠폰 목록 조회(사용자)
export async function listCoupon(page: number, size: number, sort:string, type?: string) {
    const params: any = { page, size, sort, type };
    if (type && type !== "ALL") {
        params.type = type;
    }

    const response = await axiosInstance.get(`/points/store`, { params });

    return response.data;
}

// 쿠폰 단건 조회(사용자)
export async function readCoupon(pointstoreId: number | null): Promise<PointStoreDTO> {
    const response = await axiosInstance.get(`/points/${pointstoreId}`);
    return response.data;
}

//--------------------
// 쿠폰 구매
export async function redeemCoupon(pointstoreId: number): Promise<void> {
    try {
        await axiosInstance.patch(`/points/redeem/${pointstoreId}`);
    } catch (error) {
        throw new Error("쿠폰 구매 실패");
    }
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

// 쿠폰함 사용가능한 쿠폰 개수 조회
export async function getCouponCount() {

    const response = await axiosInstance.get(`/users/mypage/coupons/count`);
    return response.data;
}


//사용자 포인트 내역 조회
export async function userPointLogs(page: number, size: number, sort:string) {
    const response = await axiosInstance.get(`/users/mypage/points/history`, {
        params: { page, size, sort },
    });
    
    return response.data;
}

