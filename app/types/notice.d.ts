// src/frontend/src/types/notice.ts

// 클라이언트에서 서버로 전송하는 DTO (공지 생성/수정)
export interface NoticeRequestDto {
    title: string;
    content: string;
}

// 서버에서 응답받는 공지 DTO
export interface NoticeResponseDto {
    noticeId: number;
    title: string;
    content: string;
    // 백엔드에서 사용하는 등록일/수정일 필드명에 맞춰주세요
    regDate: string;
    updDate: string;
    // 이미지 URL 배열
    imgUrls: string[];
}

// 스프링 Data JPA의 Page<T> 구조
export interface PageDto<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    number: number;
    size: number;
    numberOfElements: number;
    empty: boolean;
}

// 공지사항 페이징 응답 타입
export type NoticePageDto = PageDto<NoticeResponseDto>;
