// 타입 선언만

export interface PointStoreDTO {
    pointstoreId: number;
    item: string;
    price: number;
    description: string;
    productType: PointProductType; // enum 사용
    imgUrl: string;
    isHidden: boolean;
}

export interface PointStoreListDTO {
    pointstoreId: number;
    item: string;
    price: number;
    productType: PointProductType; // enum 사용
    imgUrl: string;
}
export interface PointStoreAddDTO {
    item: string;
    price: number;
    description: string;
    productType: PointProductType | ""; // enum 사용
    imgUrl: string;
}

interface UpdateCouponFormData {
    imageFile?: File;
    item: string;
    price: number;
    description: string;
    productType: string;
    imgUrl?: string;
}

export interface UserCouponDTO {
    couponId: number;
    itemName: string; // 상품 이름
    status: CouponStatus;
    couponImg:string;
    usedAt: string;
    expiredAt: string;
}

export interface PointLogsDTO {
    pointLogId: number;
    amount: number;
    type: PointLogsType;
    description: PointLogsDesc;
    regDate: string;
}


