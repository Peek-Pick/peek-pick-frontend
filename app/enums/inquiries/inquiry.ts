export const INQUIRY_TYPES: { value: InquiryType; label: string }[] = [
    { value: "ACCOUNT",      label: "ACCOUNT/LOGIN" },
    { value: "POINT_REVIEW", label: "POINT/REVIEW" },
    { value: "PRODUCT_ADD",  label: "PRODUCT ADD" },
    { value: "HOW_TO_USE",   label: "HOW TO USE" },
    { value: "BUG",          label: "ERROR/BUG" },
    { value: "ETC",          label: "ETC" },
];

export const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
    PENDING: "PENDING",
    ANSWERED: "ANSWERED",
};