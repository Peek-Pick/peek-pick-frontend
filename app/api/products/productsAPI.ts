import axiosInstance from "~/instance/axiosInstance";
import type { ProductListDTO, ProductDetailDTO, PageResponseCursor } from "~/types/products";

const host = "http://localhost:8080/api/v1/products";

/**
 * 상품 랭킹 커서 기반 목록 조회
 * @param size 페이지 크기
 * @param lastValue 정렬 기준 값 (likeCount 또는 score)
 * @param lastProductId 보조 커서 (productId)
 * @param category 카테고리 필터
 * @param sortParam 정렬 기준 문자열 ("likeCount,DESC" 등)
 */
export async function listProducts(
    size: number,
    lastValue?: number,
    lastProductId?: number,
    category?: string,
    sortParam: string = "likeCount,DESC"
): Promise<PageResponseCursor<ProductListDTO>> {
    const sortKey = sortParam.split(",")[0]; // "likeCount,DESC" → "likeCount"

    const res = await axiosInstance.get<PageResponseCursor<ProductListDTO>>(`${host}/ranking`, {
        params: {
            size,
            ...(lastValue !== undefined && { lastValue }),
            ...(lastProductId !== undefined && { lastProductId }),
            ...(category && { category }),
            sort: sortKey,
        },
    });
    return res.data;
}

/**
 * 상품 상세 정보 조회
 */
export async function getProductDetail(barcode: string): Promise<ProductDetailDTO> {
    const res = await axiosInstance.get<ProductDetailDTO>(`${host}/${barcode}`);
    return res.data;
}

/**
 * 상품 좋아요 토글 요청
 */
export async function toggleProductLike(barcode: string): Promise<void> {
    await axiosInstance.post(`${host}/${barcode}/like`);
}

/**
 * 상품 검색 커서 기반 조회
 * @param size 페이지 크기
 * @param lastValue 정렬 기준 값 (likeCount 또는 score)
 * @param lastProductId 보조 커서
 * @param category 카테고리
 * @param keyword 검색어
 * @param sortParam 정렬 기준 문자열 ("score,DESC" 등)
 */
export async function searchProducts(
    size: number,
    lastValue?: number,
    lastProductId?: number,
    category?: string,
    keyword: string = "",
    sortParam: string = "likeCount,DESC"
): Promise<PageResponseCursor<ProductListDTO>> {
    const sortKey = sortParam.split(",")[0];

    const params: Record<string, any> = {
        size,
        keyword,
        sort: sortKey,
    };
    if (category) params.category = category;
    if (lastValue !== undefined) params.lastValue = lastValue;
    if (lastProductId !== undefined) params.lastProductId = lastProductId;

    const res = await axiosInstance.get<PageResponseCursor<ProductListDTO>>(`${host}/search`, { params });
    return res.data;
}

/**
 * 추천 상품 목록 조회 (커서 기반)
 * @param size 페이지 크기
 * @param lastValue 정렬 기준 값 (likeCount 또는 score)
 * @param lastProductId 보조 커서
 * @param sortParam 정렬 기준 ("likeCount,DESC" 등)
 */
export async function getRecommendedProducts(
    size: number,
    lastValue?: number,
    lastProductId?: number,
    sortParam: string = "likeCount,DESC"
): Promise<PageResponseCursor<ProductListDTO>> {
    const sortKey = sortParam.split(",")[0];

    const res = await axiosInstance.get<PageResponseCursor<ProductListDTO>>(`${host}/recommended`, {
        params: {
            size,
            ...(lastValue !== undefined && { lastValue }),
            ...(lastProductId !== undefined && { lastProductId }),
            sort: sortKey,
        },
    });
    return res.data;
}

/**
 * 사용자 상품 좋아요 개수 조회
 * @param userId 유저 아이디
 */
export const getWishlistCount = async (): Promise<number> => {
    const response = await axiosInstance.get(`${host}/wishCount`);
    return response.data;
};