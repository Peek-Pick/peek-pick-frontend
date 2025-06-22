interface ReviewAddDTO {
    productId: number;
    score: number;
    comment: string;
    tagIdList: number[];
}

interface ReviewSimpleDTO {
    reviewId: number;
    userId: number;
    productId: number;
    score: number;
    recommendCnt: number;
    comment: string;
    isHidden: boolean;
    regDate: string;
    modDate: string;
    image: ReviewImgDTO;
    nickname: string;
    isLiked: boolean;
    name: string;
    imageThumbUrl: string;
}

interface ReviewDetailDTO {
    reviewId: number;
    userId: number;
    productId: number;
    score: number;
    recommendCnt: number;
    comment: string;
    isHidden: boolean;
    regDate: string;
    modDate: string;
    images: ReviewImgDTO[];
    nickname: string;
    profileImageUrl: string;
    isLiked: boolean;
    tagList: TagDTO[];
    name: string;
    imageUrl: string;
}

interface ReviewImgDTO {
    imgId: number;
    reviewId: number;
    imgUrl: string;
}

interface ReviewReportDTO {
    reviewId: number;
    reason: ReportReason;
}

interface AdminReviewSimpleDTO {
    reviewId: number;
    userId: number;
    productId: number;
    regDate: string;
    modDate: string;
    nickname: string;
    name: stinrg;
}

interface AdminReviewDetailDTO {
    reviewId: number;
    userId: number;
    productId: number;
    score: number;
    comment: string;
    images: ReviewImgDTO[];
    tagList: TagDTO[];
    regDate: string;
    modDate: string;
    nickname: string;
    profileImageUrl: string;
    recommendCnt: number;
    reportCnt: number;
    isHidden: boolean;
    name: stinrg;
    email: string;
}

interface AdminReviewReportDTO {
    reviewReportId: number;
    userId: number;
    reviewId: number;
    reviewerId: number
    reason: ReportReason;
    regDate: string;
}

interface aiReviewDTO {
    percent: number;
    positiveSummary: string;
    negativeSummary: string;
}