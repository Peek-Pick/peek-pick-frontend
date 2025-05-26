/**
 * 상품 목록 조회 시 반환되는 DTO
 */
export interface ProductListDTO {
    product_id: number;
    name: string;
    category?: string | null;
    img_url?: string | null;
    like_count?: number;
}

/**
 * 페이지네이션 응답 공통 타입
 * Spring Data JPA의 Page 객체가 반환하는 snake_case 필드에 맞춰 정의합니다.
 */
export interface PageResponse<T> {
    content: T[];
    total_elements: number;
    total_pages: number;
    size: number;
    number: number;
}
