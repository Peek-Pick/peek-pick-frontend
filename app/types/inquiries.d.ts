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
    userNickname: string;
    title: string;
    content: string;
    type: InquiryType;
    status: InquiryStatus;
    isDelete: boolean;
    regDate: string;
    modDate: string;
    imgUrls: string[];
}