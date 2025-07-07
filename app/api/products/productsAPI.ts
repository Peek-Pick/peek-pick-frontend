// src/api/products/productsAPI.ts
import axiosInstance from "~/instance/axiosInstance";
import type { ProductListDTO, ProductDetailDTO, PageResponseCursor } from "~/types/products";

const host = "http://localhost:8080/api/v1/products";

/**
 * 상품 랭킹 커서 기반 목록 조회
 */
export async function getRanking(
    size: number,
    lastValue?: number,
    lastProductId?: number,
    category?: string,
    sortParam: string = "likeCount,DESC",
    lang: string = "en"                      // ← 기본값 및 인자 추가
): Promise<PageResponseCursor<ProductListDTO>> {
    const sortKey = sortParam.split(",")[0];
    const res = await axiosInstance.get<PageResponseCursor<ProductListDTO>>(
        `${host}/ranking`,
        {
            params: {
                size,
                ...(lastValue     !== undefined && { lastValue }),
                ...(lastProductId !== undefined && { lastProductId }),
                ...(category      && { category }),
                sort: sortKey,
                lang                               // ← 여기에 lang
            },
        }
    );
    return res.data;
}

/**
 * 상품 상세 정보 조회
 */
export async function getProductDetail(
    barcode: string,
    lang: string = "en"                      // ← lang 추가
): Promise<ProductDetailDTO> {
    const res = await axiosInstance.get<ProductDetailDTO>(
        `${host}/${barcode}`,
        { params: { lang } }                 // ← params.lang
    );
    return res.data;
}

/**
 * 상품 좋아요 토글 요청
 */
export async function toggleProductLike(barcode: string): Promise<void> {
    // 좋아요 토글은 별도 언어 처리가 필요 없으니 그대로 두셔도 됩니다
    await axiosInstance.post(`${host}/${barcode}/like`);
}

/**
 * 상품 검색 커서 기반 조회
 */
export async function searchProducts(
    size: number,
    lastValue?: number,
    lastProductId?: number,
    category?: string,
    keyword: string = "",
    sortParam: string = "score,DESC",
    lang: string = "en"                      // ← lang 추가
): Promise<PageResponseCursor<ProductListDTO>> {
    const sortKey = sortParam.split(",")[0];
    const params: Record<string, any> = {
        size,
        keyword,
        sort: sortKey,
        lang                                    // ← lang
    };
    if (category)      params.category      = category;
    if (lastValue   !== undefined) params.lastValue   = lastValue;
    if (lastProductId!== undefined) params.lastProductId= lastProductId;

    const res = await axiosInstance.get<PageResponseCursor<ProductListDTO>>(
        `${host}/search`,
        { params }
    );
    return res.data;
}

/**
 * 정확도(_score) 정렬 전용 OFFSET 기반 검색
 */
export async function searchProductsByScore(
    size: number,
    page: number,
    category?: string,
    keyword: string = "",
    lang: string = "en"                      // ← lang 추가
): Promise<ProductListDTO[]> {
    const params: Record<string, any> = {
        size,
        page,
        sort: "_score",
        keyword,
        lang                                   // ← lang
    };
    if (category) params.category = category;

    const res = await axiosInstance.get<PageResponseCursor<ProductListDTO>>(
        `${host}/search`,
        { params }
    );
    return res.data.content;
}

/**
 * 추천 상품 목록 조회 (커서 기반)
 */
export async function getRecommendedProducts(
    size: number,
    lastValue?: number,
    lastProductId?: number,
    lang: string = "en"                      // ← lang 추가
): Promise<PageResponseCursor<ProductListDTO>> {
    const res = await axiosInstance.get<PageResponseCursor<ProductListDTO>>(
        `${host}/recommended`,
        {
            params: {
                size,
                ...(lastValue     !== undefined && { lastValue }),
                ...(lastProductId !== undefined && { lastProductId }),
                lang                           // ← lang
            },
        }
    );
    return res.data;
}

/** 사용자 상품 좋아요(찜) 개수 조회 */
export const getWishlistCount = async (lang: string = "en"): Promise<number> => {
    const response = await axiosInstance.get<number>(`${host}/wishCount`, { params: { lang } } );
    return response.data;
};