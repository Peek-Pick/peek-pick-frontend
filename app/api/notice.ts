// src/frontend/src/api/notice.ts

import axios from "axios";
import type {
    NoticePageDto,
    NoticeResponseDto,
    NoticeRequestDto,
} from "~/types/notice";

const BASE_URL = "http://localhost:8080/admin/notices";

// 공지사항 목록(페이징) 조회
export function fetchNotices() {
    return axios.get<NoticePageDto>(BASE_URL);
}

// 단일 공지 조회
export function fetchNotice(id: number) {
    return axios.get<NoticeResponseDto>(`${BASE_URL}/${id}`);
}

// 공지사항 생성
export function createNotice(data: NoticeRequestDto) {
    return axios.post<NoticeResponseDto>(BASE_URL, data);
}

// 공지사항 수정
export function updateNotice(id: number, data: NoticeRequestDto) {
    return axios.put<NoticeResponseDto>(`${BASE_URL}/${id}`, data);
}

// 공지사항 삭제
export function deleteNotice(id: number) {
    return axios.delete<void>(`${BASE_URL}/${id}`);
}

// 공지사항 이미지 업로드
export function uploadImages(id: number, files: FileList) {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));
    return axios.post<void>(`${BASE_URL}/${id}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
}
