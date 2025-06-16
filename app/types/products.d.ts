/**
 * 상품 목록 조회 시 반환되는 DTO
 */
export interface ProductListDTO {
    productId: number;
    barcode: string;
    name: string;
    category?: string | null;
    imgUrl?: string | null;
    likeCount?: number | null;
    reviewCount?: number | null;
    score?: number | null;
    /** soft-delete 여부 */
    isDelete?: boolean | null;
    rank?: number;
}

/**
 * 페이지네이션 응답 공통 타입
 */
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
}

/**
 * 상품 상세 조회 시 반환되는 DTO
 */
export interface ProductDetailDTO {
    /** 상품 id */
    productId: number;
    /** 바코드 */
    barcode: string;
    /** 상품명 */
    name: string;
    /** 카테고리 */
    category?: string | null;
    /** 상품 설명 (세부정보) */
    description?: string | null;
    /** 용량 */
    volume?: string | null;
    /** 이미지 URL */
    imgUrl?: string | null;
    /** 원재료 */
    ingredients?: string | null;
    /** 알레르기 정보 */
    allergens?: string | null;
    /** 영양 성분 */
    nutrition?: string | null;
    /** 좋아요 수 */
    likeCount?: number | null;
    /** 리뷰 수 */
    reviewCount?: number | null;
    /** 별점 */
    score?: number | null;
    /** 로그인 사용자 좋아요 여부 */
    isLiked?: boolean | null;
    /** soft-delete 여부 */
    isDelete?: boolean | null;
}
