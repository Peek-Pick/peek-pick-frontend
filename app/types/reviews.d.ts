interface ReviewAddDTO {
    productId: number;
    score: number;
    comment: string;
    tagIdList: number[];
}

interface ReviewSimpleDTO {
    review_id: number;
    user_id: number;
    product_id: number;
    score: number;
    recommend_cnt: number;
    comment: string;
    is_hidden: boolean;
    reg_date: string;
    mod_date: string;
    image: ReviewImgDTO;
    nickname: string;
    is_liked: boolean;
    name: string;
    image_url: string;
}

interface ReviewDetailDTO {
    review_id: number;
    user_id: number;
    product_id: number;
    score: number;
    recommend_cnt: number;
    comment: string;
    is_hidden: boolean;
    reg_date: string;
    mod_date: string;
    images: ReviewImgDTO[];
    nickname: string;
    is_liked: boolean;
    tag_list: TagDTO[];
    name: string;
    image_url: string;
}

interface ReviewImgDTO {
    img_id: number;
    review_id: number;
    img_url: string;
}

interface ReviewReportDTO {
    review_id: number;
    reason: ReportReason;
}