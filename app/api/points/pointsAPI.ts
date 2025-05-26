import axios from "axios";
import axiosInstance from "~/instance/axiosInstance";
import type {PointStoreDTO} from "~/types/points";


const host = "http://localhost:8080/api/v1";

// 쿠폰 단건 조회
export async function readCoupon(pointstoreId: number | null): Promise<PointStoreDTO> {
    const response = await axiosInstance.get(`${host}/admin/points/${pointstoreId}`);
    const result = response.data;

    // 카멜케이스 변환
    return {
        pointstoreId: result.pointstore_id,
        item: result.item,
        price: result.price,
        productType: result.product_type,
        imgUrl: result.img_url,
        description: result.description,
    };
}

// 쿠폰 목록 조회 (관리자용)
export async function listCoupon(page: number, size: number, sort:string, type?: string) {
    const params: any = { page, size, sort, type };
    if (type && type !== "ALL") {
        params.type = type;
    }

    const response = await axiosInstance.get(`${host}/admin/points`, { params });

    const result = response.data;
    return { // 카멜로 변환..
        ...result,
        content: result.content.map((item: any) => ({
            pointstoreId: item.pointstore_id,
            item: item.item,
            price: item.price,
            productType: item.product_type,
            imgUrl: item.img_url,
        })),
        totalElements: result.total_elements,
        totalPages: result.total_pages,
    };
}


// 쿠폰 추가 (FormData 사용, @ModelAttribute 기준)
export async function addCoupon(data: FormData): Promise<number> {
    const response = await axiosInstance.post(`${host}/admin/points`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data; // 생성된 ID
}

// 쿠폰 수정
export async function updateCoupon(pointstoreId: number, data: FormData): Promise<void> {
    await axiosInstance.put(`${host}/admin/points/${pointstoreId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

// 쿠폰 삭제 (soft-delete)
export async function deleteCoupon(pointstoreId: number): Promise<void> {
    await axiosInstance.patch(`${host}/admin/points/${pointstoreId}`);
}
//--------------------
// 쿠폰 구매
export async function redeemCoupon(pointstoreId: number): Promise<void> {
    await axiosInstance.patch(`${host}/points/redeem/${pointstoreId}`);
}

// 사용자 쿠폰함 - 쿠폰 목록 조회
export async function userCouponList(page: number, size: number, sort: string, status?: string) {
    const params: any = { page, size, sort, status };
    if (status && status !== "ALL") {
        params.status = status;
    }
    const response = await axiosInstance.get(`${host}/users/mypage/coupons`, { params });

    const result = response.data;
    return {
        ...result,
        content: result.content.map((item: any) => ({
            couponId: item.coupon_id,
            itemName: item.item_name,
            status: item.status,
            couponImg: item.coupon_img,
            usedAt: item.used_at,
            expiredAt: item.expired_at,
        })),
        totalElements: result.total_elements,
        totalPages: result.total_pages,
    };
}



//사용자 포인트 내역 조회
export async function userPointLogs(page: number, size: number, sort:string) {
    const response = await axiosInstance.get(`${host}/users/mypage/points/history`, {
        params: { page, size, sort },
    });

    const result = response.data;
    return { // 카멜로 변환..
        ...result,
        content: result.content.map((item: any) => ({
            pointLogId: item.point_log_id,
            amount: item.amount,
            type: item.type,
            description: item.description,
            regDate: item.reg_date,
        })),
        totalElements: result.total_elements,
        totalPages: result.total_pages,
    };
}

