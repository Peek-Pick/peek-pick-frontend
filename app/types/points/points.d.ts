// 타입 선언만

export interface PointStoreDTO {
    pointstoreId: number;
    item: string;
    price: number;
    description: string;
    productType: PointProductType; // enum 사용
    imgUrl: string;
}

export interface PointStoreListDTO {
    pointstoreId: number;
    item: string;
    price: number;
    productType: PointProductType; // enum 사용
    imgUrl: string;
}
export interface PointStoreAddDTO {
    pointstoreId: number;
    item: string;
    price: number;
    description: string;
    productType: PointProductType | ""; // enum 사용
    imgUrl: string;
    imageFile: File | null;
}

export interface UserCouponDTO {
    couponId: number;
    itemName: string; // 상품 이름
    status: CouponStatus;
    couponImg:string;
    usedAt: string;
    expiredAt: string;
}




