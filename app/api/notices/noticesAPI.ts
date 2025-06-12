import axiosInstance from "~/instance/axiosInstance";
import type {
    NoticePageDTO,
    NoticeDetailDTO,
    NoticeListDTO,
} from "~/types/notice";

const BASE_URL = "/notices";

/** 공지 목록(페이징) 조회 */
export async function fetchNotices(
    page: number,
    size: number
): Promise<NoticePageDTO> {
    const res = await axiosInstance.get<NoticePageDTO>(
        `${BASE_URL}?page=${page}&size=${size}`
    );
    return res.data;
}

/** 단일 공지 상세 조회 */
export async function fetchNotice(
    noticeId: number
): Promise<NoticeDetailDTO> {
    const res = await axiosInstance.get<NoticeDetailDTO>(
        `${BASE_URL}/${noticeId}`
    );
    return res.data;
}
