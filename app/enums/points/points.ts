
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

export enum PointLogsType {
    EARN = "획득",
    USE = "사용",
    EXPIRED = "만료됨",
}

export enum PointLogsDesc {
    REVIEW_GENERAL = "일반 리뷰 작성",
    REVIEW_PHOTO = "포토 리뷰 작성",
    EVENT = "이벤트 참여",
    SHOP_USE = "포인트 상점 사용",
    EXPIRED = "포인트 만료",
    REFUND = "포인트 환불",
    OTHER = "기타",
}
