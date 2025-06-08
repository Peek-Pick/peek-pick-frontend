export interface quickStats {
    wishlistedCount: number;
    reviewCount: number;
    couponCount: number;
    barcodeHistoryCount: number;
}

export interface MyPageResponseDTO {
    profileImgUrl: string;
    nickname: string;
    point: number;
    quickStats: quick_stats;
}

export interface ProfileReadDTO {
    email: string;
    isSocial: boolean;

    nickname: string;
    gender: string;
    nationality: string;
    birthDate: string;
    profileImgUrl: string;

    tagIdList: number[];
}

// admin
export interface UsersListDTO {
    userId: number;
    email: string;
    isSocial: string;
    status: string;
}
