
// enum, 상수, 함수 등 런타임 코드

export enum PointProductType {
    CU = "CU",
    GS25 = "GS25",
    SEVEN_ELEVEN = "세븐일레븐",
    EMART24 = "이마트24",
    OTHERS = "기타",
}

export enum CouponStatus {
    AVAILABLE = "사용 가능",    // 사용 가능한 상태
    USED = "사용 완료",         // 이미 사용된 상태
    EXPIRED = "만료됨",
}