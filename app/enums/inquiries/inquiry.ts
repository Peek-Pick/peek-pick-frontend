export const INQUIRY_TYPES: { value: InquiryType; label: string }[] = [
    { value: "ACCOUNT",      label: "계정/로그인" },
    { value: "POINT_REVIEW", label: "포인트/리뷰" },
    { value: "PRODUCT_ADD",  label: "상품 추가" },
    { value: "HOW_TO_USE",   label: "사용 방법" },
    { value: "BUG",          label: "오류/버그" },
    { value: "ETC",          label: "기타 문의" },
];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
    PENDING: "대기중",
    ANSWERED: "답변완료",
};