import type {AxiosResponse} from "axios";
import axiosInstance from "~/instance/axiosInstance";
import axiosInstanceAdmin from "~/instance/axiosInstanceAdmin";
import type {PagingResponse} from "~/types/common";

export function fetchInquiries({ page, size }: { page: number; size: number }): Promise<PagingResponse<InquiryResponseDTO>> {
    return axiosInstance
        .get<PagingResponse<InquiryResponseDTO>>(`/inquiries`, {
            params: { page, size },
        })
        .then(res => res.data);
}

export function getUserEmail(): Promise<string | null> {
    return axiosInstance
        .get<string>("/inquiries/email")
        .then((res: AxiosResponse<string>) => res.data)
        .catch(() => null);
}

export function fetchInquiry(id: number): Promise<AxiosResponse<InquiryResponseDTO>> {
    return axiosInstance.get<InquiryResponseDTO>(`inquiries/${id}`);
}

export function createInquiry(data: InquiryRequestDTO): Promise<AxiosResponse<InquiryResponseDTO>> {
    return axiosInstance.post<InquiryResponseDTO>(`inquiries`, data);
}

export function updateInquiry(id: number, data: InquiryRequestDTO): Promise<AxiosResponse<InquiryResponseDTO>> {
    return axiosInstance.put<InquiryResponseDTO>(`inquiries/${id}`, data);
}

export function deleteInquiry(id: number): Promise<AxiosResponse<void>> {
    return axiosInstance.delete<void>(`inquiries/${id}`);
}

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

export async function deleteImages(inquiryId: number, urls: string[]) {
    await axiosInstance.delete(`inquiries/${inquiryId}/images`, {
        data: { urls },
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
export async function fetchInquiryAnswer(inquiryId: number): Promise<InquiryAnswerResponseDTO> {
    const response = await axiosInstance.get<InquiryAnswerResponseDTO>(`/inquiries/${inquiryId}/reply`);
    return response.data;
}


// 어드민
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

export async function fetchAdminInquiryAnswer(inquiryId: number): Promise<InquiryAnswerResponseDTO> {
    const response = await axiosInstanceAdmin.get<InquiryAnswerResponseDTO>(`/admin/inquiries/${inquiryId}/reply`);
    return response.data;
}

export function deleteInquiryAnswer(inquiryId: number): Promise<AxiosResponse<void>> {
    return axiosInstanceAdmin.delete<void>(`/admin/inquiries/${inquiryId}/reply`);
}