export interface ViewHistoryResponseDTO {
    isReview: boolean;
    viewId: number;
    regDate: string;
    isBarcodeHistory: boolean;
    productId: number;
    barcode: number;
    userId: number;
    productName: string;
    productImageUrl: string;
}