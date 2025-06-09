export interface ActionResult<T> {
    result: string,
    data: T
}

export interface PagingResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;  // 현재 페이지 (0-based)
}

export interface PaginationProps {
    currentPage: number;  // 0-based
    totalPages: number;
    onPageChange: (page: number) => void;
}