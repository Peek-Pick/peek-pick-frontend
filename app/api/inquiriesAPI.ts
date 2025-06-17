import type {AxiosResponse} from "axios";
import axiosInstance from "~/instance/axiosInstance";
import axiosInstanceAdmin from "~/instance/axiosInstanceAdmin";
import type {PagingResponse} from "~/types/common";

/**
 * 문의사항 목록(페이징) 조회
 */
export function fetchInquiries(page: number, size?: number) {
    return axiosInstance.get(`/inquiries`, {
        params: { page, size },
    });
}

/**
 * 단일 문의 조회
 */
export function fetchInquiry(id: number): Promise<AxiosResponse<InquiryResponseDTO>> {
    return axiosInstance.get<InquiryResponseDTO>(`inquiries/${id}`);
}

/**
 * 문의사항 생성 (텍스트 + imgUrls)
 */
export function createInquiry(data: InquiryRequestDTO): Promise<AxiosResponse<InquiryResponseDTO>> {
    return axiosInstance.post<InquiryResponseDTO>(`inquiries`, data);
}

/**
 * 문의사항 수정 (텍스트 + imgUrls)
 */
export function updateInquiry(id: number, data: InquiryRequestDTO): Promise<AxiosResponse<InquiryResponseDTO>> {
    return axiosInstance.put<InquiryResponseDTO>(`inquiries/${id}`, data);
}

/**
 * 문의사항 삭제
 */
export function deleteInquiry(id: number): Promise<AxiosResponse<void>> {
    return axiosInstance.delete<void>(`inquiries/${id}`);
}

/**
 * 문의 이미지 업로드 (여러 파일 가능)
 * 서버는 Nginx로 저장 → URL만 DB에 기록
 */
export function uploadImages(inquiryId: number, files: FileList | File[]): Promise<AxiosResponse<void>> {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
        formData.append("files", file);
    });
    return axiosInstance.post<void>(`inquiries/${inquiryId}/images`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

/**
 * 문의 이미지 삭제
 */
export async function deleteImages(inquiryId: number, urls: string[]) {
    await axiosInstance.delete(`inquiries/${inquiryId}/images`, {
        data: { urls },
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

export async function fetchAdminInquiries(params: FetchAdminInquiriesParams): Promise<{
    data: PagingResponse<InquiryResponseDTO>
}> {
    return axiosInstanceAdmin.get(`admin/inquiries`, {params});
};

export function fetchAdminInquiry(id: number): Promise<AxiosResponse<InquiryResponseDTO>> {
    return axiosInstanceAdmin.get<InquiryResponseDTO>(`admin/inquiries/${id}`);
}

export function deleteAdminInquiry(id: number): Promise<AxiosResponse<void>> {
    return axiosInstanceAdmin.delete<void>(`/admin/inquiries/${id}`);
}

export function createInquiryAnswer(inquiryId: number, data: InquiryAnswerRequestDTO): Promise<AxiosResponse<void>> {
    return axiosInstanceAdmin.post<void>(`/admin/inquiries/${inquiryId}/reply`, data);
}

export async function updateInquiryAnswer(inquiryId: number, data: InquiryAnswerRequestDTO): Promise<void> {
    await axiosInstanceAdmin.put(`/admin/inquiries/${inquiryId}/reply`, data);
}

export async function fetchInquiryAnswer(inquiryId: number): Promise<InquiryAnswerResponseDTO> {
    const response = await axiosInstanceAdmin.get<InquiryAnswerResponseDTO>(`/admin/inquiries/${inquiryId}/reply`);
    return response.data;
}

export function deleteInquiryAnswer(inquiryId: number): Promise<AxiosResponse<void>> {
    return axiosInstanceAdmin.delete<void>(`/admin/inquiries/${inquiryId}/reply`);
}