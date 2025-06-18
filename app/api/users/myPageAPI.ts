// ✅ 수정된 프론트엔드 API 호출 파일
// src/api/users/myPageAPI.ts

import axiosInstance from "~/instance/axiosInstance";
import type { ProfileReadDTO, MyPageResponseDTO } from "~/types/users";
import type { ProductListDTO, PageResponseCursor } from "~/types/products";

const host = "http://localhost:8080/api/v1/users";

export const getMyPage = async (): Promise<MyPageResponseDTO> => {
    const response = await axiosInstance.get(`${host}/mypage`, { withCredentials: true });
    return response.data;
};

export const getMyPageEdit = async (): Promise<ProfileReadDTO> => {
    const response = await axiosInstance.get(`${host}/mypage/edit`, { withCredentials: true });
    return response.data;
};

export const updateMyPage = async (formData: FormData) => {
    return axiosInstance.put(`${host}/mypage/edit`, formData);
};

// ✅ 커서 기반 찜 목록 조회 (최신순: modDate DESC, productId DESC)
export async function getMyPageFavorite(
    size: number,
    lastModDate?: string,
    lastProductId?: number
): Promise<PageResponseCursor<ProductListDTO>> {
    const res = await axiosInstance.get<PageResponseCursor<ProductListDTO>>(
        `${host}/favorites`,
        {
            params: {
                size,
                ...(lastModDate && { lastModDate }),
                ...(lastProductId !== undefined && { lastProductId }),
            },
            withCredentials: true,
        }
    );
    return res.data;
}

export async function softDeleteAccount(): Promise<void> {
    return axiosInstance.patch(`${host}/delete`, {
        status: "DELETED"
    });
}
