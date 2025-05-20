import axios from "axios";
import type {PointStoreAddDTO, PointStoreDTO} from "~/types/points";


const host = "http://localhost:8080/api/admin/points";

// 상품 단건 조회
export async function readCoupon(pointstoreId: number): Promise<PointStoreDTO> {
    const response = await axios.get(`/api/v1/admin/points/${pointstoreId}`);
    return response.data;
}

// 상품 목록 조회 (관리자용)
export async function listCoupon(page: number, size: number) {
    const response = await axios.get(`/api/v1/admin/points`, {
        params: { page, size },
    });
    return response.data; // Page<PointStoreListDTO>
}


// 상품 추가 (FormData 사용, @ModelAttribute 기준)
export async function addCoupon(data: FormData): Promise<number> {
    const response = await axios.post("/api/v1/admin/points", data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data; // 생성된 ID
}

// 상품 수정
export async function updateCoupon(pointstoreId: number, data: FormData): Promise<void> {
    await axios.put(`/api/v1/admin/points/${pointstoreId}`, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

// 상품 삭제 (soft-delete)
export async function deleteCoupon(pointstoreId: number): Promise<void> {
    await axios.patch(`/api/v1/admin/points/${pointstoreId}`);
}