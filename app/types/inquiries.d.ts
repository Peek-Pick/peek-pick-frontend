export type InquiryType =
    | "ACCOUNT"
    | "PRODUCT_ADD"
    | "POINT_REVIEW"
    | "HOW_TO_USE"
    | "BUG"
    | "ETC";

export type InquiryStatus = "PENDING" | "ANSWERED";

// 클라이언트 → 서버 요청 DTO (텍스트 + imgUrls)
export interface InquiryRequestDTO {
    title: string;
    content: string;
    type: InquiryType;
    imgUrls: string[];
}

// 서버 → 클라이언트 응답 DTO
export interface InquiryResponseDTO {
    inquiryId: number;
    userId: number;
    title: string;
    content: string;
    type: InquiryType;
    status: InquiryStatus;
    regDate: string;
    updDate: string;
    imgUrls: string[];
}

// 스프링 Data JPA Page<T> 구조
export interface PageDTO<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    number: number;
    size: number;
    numberOfElements: number;
    empty: boolean;
}

// 문의사항 페이징 응답 타입
export type InquiryPageDTO = PageDTO<InquiryResponseDTO>;