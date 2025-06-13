import axiosInstance from "~/instance/axiosInstance";
import type {ProductListDTO, PageResponse, ProductDetailDTO} from "~/types/products";


const host = "http://localhost:8080/api/v1/products";


export async function listProducts(page: number, size: number, sort: string = "likeCount,DESC",category?: string, keyword?: string)
    : Promise<PageResponse<ProductListDTO>> {
    const res = await axiosInstance.get<PageResponse<ProductListDTO>>(
        `${host}/ranking`,
        {params:
            {
            page, size, sort, ...(category && { category }), ...(keyword && { keyword }),
            },
        }
    );
    return res.data;
}

export async function getProductDetail(
    barcode: string
): Promise<ProductDetailDTO> {
    const res = await axiosInstance.get<ProductDetailDTO>(
        `${host}/${barcode}`
    );
    return res.data;
}

/**
 * 상품 좋아요 토글 요청
 * @param barcode 좋아요를 누를 상품의 바코드
 * @returns 서버에서 반환하는 응답 데이터 (필요 시 타입 정의 후 리턴)
 */
export async function toggleProductLike(barcode: string): Promise<void> {
    await axiosInstance.post(`${host}/${barcode}/like`);
}


export async function searchProducts(
    page: number,
    size: number,
    sort: string = "likeCount,DESC",
    category?: string,
    keyword?: string
): Promise<PageResponse<ProductListDTO>> {
    const params: Record<string, any> = { page, size, sort };

    // 검색은 keyword가 필수이므로, keyword가 없으면 빈 문자열("")이라도 넘겨주도록 합니다.
    if (category) params.category = category;
    if (keyword) params.keyword = keyword;

    const res = await axiosInstance.get<PageResponse<ProductListDTO>>(
        `${host}/search`,
        { params }
    );
    return res.data;
}

/**
 * 추천 상품 목록 조회
 * 로그인한 사용자의 관심 태그에 매칭되는 상품들을 페이징하여 반환
 */
export async function getRecommendedProducts(
    page: number,
    size: number
): Promise<PageResponse<ProductListDTO>> {
    const res = await axiosInstance.get<PageResponse<ProductListDTO>>(
        `${host}/recommended`,
        {
            params: {
                page,
                size,
            },
        }
    );
    return res.data;
}
