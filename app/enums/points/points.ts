
// enum, 상수, 함수 등 런타임 코드

export enum PointProductType {
    CU = "CU",
    GS25 = "GS25",
    SEVEN_ELEVEN = "SEVEN-ELEVEN",
    EMART24 = "EMART24",
    OTHERS = "OTHERS",
}

export enum CouponStatus {
    AVAILABLE = "Available",    // 사용 가능한 상태
    USED = "Used",         // 이미 사용된 상태
    EXPIRED = "Expired",
}

export enum PointLogsType {
    EARN = "Earn",
    USE = "Used",
    EXPIRED = "Expired",
}

export enum PointLogsDesc {
    REVIEW_GENERAL = "Write general review",
    REVIEW_PHOTO = "Write photo review",
    EVENT = "Participate in event",
    SHOP_USE = "Use point shop",
    EXPIRED = "Points expired",
    REFUND = "Points refunded",
    OTHER = "Other",
}
