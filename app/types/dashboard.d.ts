interface AdminDashInquiryDTO {
    inquiryId: number,
    nickname: string,
    content: string,
    type: InquiryType,
    status: InquiryStatus,
    regDate: string,
}

interface AdminDashReportDTO {
    reviewReportId: number;
    reviewId: number;
    reviewerId: number
    nickname: string,
    reason: ReportReason;
    regDate: string;
}
interface AdminDashChart {
    x: string;
    y: number;
}