export interface quick_stats {
    wishlisted_count: number;
    review_count: number;
    coupon_count: number;
    barcode_history_count: number;
}

export interface MyPageResponseDTO {
    profile_img_url: string;
    nickname: string;
    point: number;
    quick_stats: quick_stats;
}

export interface ProfileReadDTO {
    email: string;
    password: string;
    isSocial: boolean;

    nickname: string;
    gender: string;
    nationality: string;
    birthDate: string;
    profileImgUrl: string;

    tagIdList: number[];
}
