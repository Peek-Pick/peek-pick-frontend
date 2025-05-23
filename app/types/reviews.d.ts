interface ReviewAddDTO {
    score: number;
    comment: string;
}

interface ReviewSimpleDTO {
    review_id: number;
    user_id: number;
    score: number;
    recommend_cnt: number;
    comment: string;
    is_hidden: boolean;
    reg_date: string;
    mod_date: string;
    image: ReviewImgDTO;
    nickname: string;
    is_liked: boolean;
}

interface ReviewDetailDTO {
    review_id: number;
    user_id: number;
    score: number;
    recommend_cnt: number;
    comment: string;
    is_hidden: boolean;
    reg_date: string;
    mod_date: string;
    images: ReviewImgDTO[];
    nickname: string;
    is_liked: boolean;
}

interface ReviewImgDTO {
    review_id: number;
    img_url: string;
}

interface ReviewReportDTO {
    reviewId: number;
    reason: ReportReason;
}