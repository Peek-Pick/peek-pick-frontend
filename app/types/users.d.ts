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

// ========= Admin =========
export interface UsersListDTO {
    userId: number;
    email: string;
    isSocial: boolean;
    status: string;
    banUntil?: string;
}

export interface UsersDetailDTO {
    nickname: string;
    email: string;
    profileImgUrl: string;
    isSocial: boolean;
    gender: string;
    nationality: string;
    birthDate: string;
    status: string;
    tagIdList: number[];
    regDate: string;
}

export interface UpdateStatus {
    status: "ACTIVE" | "BANNED" | "DELETED";
    banUntil?: string; // YYYY-MM-DD
}

export interface UpdateUserStatus {
    userId: number;
    updateStatus: UpdateStatus;
}