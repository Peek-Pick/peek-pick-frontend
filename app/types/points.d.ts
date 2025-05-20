
export enum PointProductType {
    CU = "CU",
    GS25 = "GS25",
    SEVEN_ELEVEN = "세븐일레븐",
    EMART24 = "이마트24",
    OTHERS = "기타",
}

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
    productType: PointProductType; // enum 사용
    imgUrl: string;
    imageFile: File;
}



