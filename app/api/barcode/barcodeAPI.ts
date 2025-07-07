import axiosInstance from "~/instance/axiosInstance";
import type {ViewHistoryResponseDTO} from "~/types/viewHistory";

// 서버에 스캔한 바코드를 전달하고, 히스토리 저장 성공 시 같은 바코드 문자열을 그대로 반환
export async function scanBarcode(barcode: string): Promise<string | null> {
    try {
        const resp = await axiosInstance.post<string>(`/barcode/scan/${barcode}`, null);
        return resp.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;        // 404면 null 반환
        }
        throw error;            // 404가 아닌 다른 에러는 던짐
    }
}

export async function getBarcodeHistory(): Promise<ViewHistoryResponseDTO[]> {
    const res = await axiosInstance.get("/barcode/history");
    console.log(res.data);
    return res.data;
}

export async function getBarcodeHistoryCount(): Promise<number> {
    const res = await axiosInstance.get<number>("/barcode/history/count");
    return res.data;
}

export async function nullBarcode() {
    try {
        const res = await axiosInstance.get<number>("/barcode");
        return res.data; // 응답 데이터 반환
    } catch (error) {
        console.error("nullBarcode API 호출 실패:", error);
        throw error;  // 필요하면 호출한 쪽에서 에러 처리
    }
}