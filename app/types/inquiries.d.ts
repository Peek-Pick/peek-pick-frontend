type InquiryType =
    | "ACCOUNT"
    | "PRODUCT_ADD"
    | "POINT_REVIEW"
    | "HOW_TO_USE"
    | "BUG"
    | "ETC";

type InquiryStatus = "PENDING" | "ANSWERED";

// 클라이언트 → 서버 요청 DTO (텍스트 + imgUrls)
interface InquiryRequestDTO {
    content: string,
    type: InquiryType,
    imgUrls: string[]
}

// 서버 → 클라이언트 응답 DTO
interface InquiryResponseDTO {
    inquiryId: number,
    userId: number,
    userEmail: string,
    userNickname: string,
    userProfileImgUrl: string,
    content: string,
    type: InquiryType,
    status: InquiryStatus,
    isDelete: boolean,
    regDate: string,
    modDate: string,
    imgUrls: string[]
    reply?: {
        replyId: number;
        content: string;
        modDate: string;
    } | null;
}

interface FetchAdminInquiriesParams {
    page: number,
    size: number,
    keyword?: string,       // 검색어 (선택)
    status?: string,        // 상태 필터 (선택)
    category?: string,      // 문의 유형 필터 (선택)
    isDeleted?: boolean    // 삭제 여부 필터 (선택)
}

interface InquiryAnswerRequestDTO {
    content: string
}

interface InquiryAnswerResponseDTO {
    content: string,
    regDate: string
}