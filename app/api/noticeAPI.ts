import axiosInstance from "~/instance/axiosInstance";
import type {
    NoticePageDto,
    NoticeResponseDto,
    NoticeRequestDto,
} from "~/types/notice";

const BASE_URL = "http://localhost:8080/api/v1/admin/notices";

/** 공지사항 목록(페이징) 조회 */
export async function fetchNotices(
    page: number,
    size: number
): Promise<NoticePageDto> {
    const res = await axiosInstance.get<NoticePageDto>(
        `${BASE_URL}?page=${page}&size=${size}`
    );
    return res.data;
}

/** 단일 공지 조회 */
export async function fetchNotice(id: number): Promise<NoticeResponseDto> {
    const res = await axiosInstance.get<NoticeResponseDto>(`${BASE_URL}/${id}`);
    return res.data;
}

//공지 생성
export function createNotice(data: NoticeRequestDto) {
    return axiosInstance.post<NoticeResponseDto>(BASE_URL, {
        title: data.title,
        content: data.content,
        img_urls: data.imgUrls,    // ← 여기
    });
}

// — 공지 수정 —
// 마찬가지로 img_urls
export function updateNotice(
    id: number,
    data: NoticeRequestDto
) {
    return axiosInstance.put<NoticeResponseDto>(
        `${BASE_URL}/${id}`,
        {
            title: data.title,
            content: data.content,
            img_urls: data.imgUrls,   // ← 그리고 여기
        }
    );
}

/** 공지 삭제 */
export async function deleteNotice(id: number): Promise<void> {
    await axiosInstance.delete<void>(`${BASE_URL}/${id}`);
}

/** 공지 이미지 업로드 */
export async function uploadImages(
    id: number,
    files: FileList
): Promise<void> {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    await axiosInstance.post<void>(
        `${BASE_URL}/${id}/images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
}
