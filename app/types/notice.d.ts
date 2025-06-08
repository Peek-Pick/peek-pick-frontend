// src/types/notice.ts

import { PagingResponse } from "./common";

/**
 * 공지사항 생성/수정 요청용 DTO
 */
export interface NoticeRequestDto {
    title: string;
    content: string;
    /**
     * 백엔드에 보낼 이미지 URL 배열.
     * 이미지 업로드 후, 반환받은 URL 목록을 여기에 담아서 전송합니다.
     */
    imgUrls: string[];
}

/**
 * 공지사항 응답용 DTO
 */
export interface NoticeResponseDto {
    noticeId: number;
    title: string;
    content: string;
    regDate: string;  // 예: "2025-06-05T14:25:30"
    modDate: string;
    imgUrls: string[]; // 백엔드에 저장된 imgUrl 목록
}

/**
 * 공지사항 페이지 조회 응답 DTO (PagingResponse 상속)
 */
export type NoticePageDto = PagingResponse<NoticeResponseDto>;
