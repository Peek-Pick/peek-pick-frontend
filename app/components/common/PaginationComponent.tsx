interface PaginationProps {
    currentPage: number;    // 현재 페이지 (0-based)
    totalPages: number;     // 총 페이지 수
    onPageChange: (page: number) => void; // 페이지 변경 콜백
    maxPageButtons?: number; // 한번에 표시할 페이지 버튼 최대 개수 (옵션)
}

export default function PaginationComponent({
                                                currentPage,
                                                totalPages,
                                                onPageChange,
                                                maxPageButtons = 10,
                                            }: PaginationProps) {
    if (totalPages === 0) return null;

    // 페이지 버튼 표시 범위 계산 (중앙을 기준으로 maxPageButtons 수만큼 보여줌)
    let startPage = Math.max(0, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;

    if (endPage >= totalPages) {
        endPage = totalPages - 1;
        startPage = Math.max(0, endPage - maxPageButtons + 1);
    }

    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    const onPrevious = () => {
        if (currentPage > 0) onPageChange(currentPage - 1);
    };

    const onNext = () => {
        if (currentPage < totalPages - 1) onPageChange(currentPage + 1);
    };

    return (
        <nav aria-label="Page navigation" className="mt-8">
            <ul className="flex justify-center space-x-3">
                {/* 이전 버튼 */}
                <li>
                    <button
                        type="button"
                        onClick={onPrevious}
                        disabled={currentPage === 0}
                        className={`w-9 h-9 flex items-center justify-center font-medium text-gray-500 transition-colors duration-200 relative ${
                            currentPage === 0 ? "cursor-not-allowed opacity-50" : "hover:text-blue-600"
                        } focus:outline-none`}
                        aria-disabled={currentPage === 0}
                        aria-label="Previous page"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </li>

                {/* 페이지 번호 버튼 */}
                {pageNumbers.map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                        <li key={pageNum}>
                            <button
                                type="button"
                                onClick={() => onPageChange(pageNum)}
                                aria-current={isActive ? "page" : undefined}
                                className={`px-4 py-2 font-medium relative transition-colors duration-200 ${
                                    isActive
                                        ? "text-gray-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-green-600"
                                        : "text-gray-500 hover:text-gray-600"
                                } focus:outline-none`}
                            >
                                {pageNum + 1}
                            </button>
                        </li>
                    );
                })}

                {/* 다음 버튼 */}
                <li>
                    <button
                        type="button"
                        onClick={onNext}
                        disabled={currentPage === totalPages - 1}
                        className={`w-9 h-9 flex items-center justify-center font-medium text-gray-500 transition-colors duration-200 relative ${
                            currentPage === totalPages - 1
                                ? "cursor-not-allowed opacity-50"
                                : "hover:text-blue-600"
                        } focus:outline-none`}
                        aria-disabled={currentPage === totalPages - 1}
                        aria-label="Next page"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
    );
}