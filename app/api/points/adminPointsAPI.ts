
import type {PointStoreDTO} from "~/types/points";
import axiosInstanceAdmin from "~/instance/axiosInstanceAdmin";


// 쿠폰 단건 조회
export async function readCoupon(pointstoreId: number | null): Promise<PointStoreDTO> {
    const response = await axiosInstanceAdmin.get(`/admin/points/${pointstoreId}`);
    return response.data;
}

// 쿠폰 목록 조회 (Admin)
export async function listAdminCoupon (page: number, category?: string, keyword?: string, hidden?: boolean) {
    const params: Record<string, string> = {
        page: String(page),
        sort: "regDate,desc",
    };

    if (category) params.category = category;
    if (keyword) params.keyword = keyword;
    if (hidden !== undefined) params.hidden = String(hidden);

    const response = await axiosInstanceAdmin.get(`admin/points`, {params});

    return response.data;
}


// 쿠폰 추가 (FormData 사용, @ModelAttribute 기준)
export async function addCoupon(data: FormData): Promise<number> {
    const response = await axiosInstanceAdmin.post(`/admin/points`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data; // 생성된 ID
}

// 쿠폰 수정
export async function updateCoupon(pointstoreId: number, data: FormData): Promise<void> {
    await axiosInstanceAdmin.put(`/admin/points/${pointstoreId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

// 쿠폰 삭제 (soft-delete)
export async function deleteCoupon(pointstoreId: number): Promise<void> {
    await axiosInstanceAdmin.patch(`/admin/points/${pointstoreId}`);
}