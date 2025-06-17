import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number; // 0-based index
    totalPages: number; // 총 페이지 수 (예: 50개면 0~49)
    onPageChange: (page: number) => void;
    maxPageButtons?: number; // 기본값 5
}

function PaginationComponent({
                                 currentPage,
                                 totalPages,
                                 onPageChange,
                                 maxPageButtons = 5,
                             }: PaginationProps) {
    if (totalPages === 0) return null;

    // 현재 페이지가 속한 그룹 (0-based)
    const currentGroup = Math.floor(currentPage / maxPageButtons);

    const startPage = currentGroup * maxPageButtons;
    const endPage = Math.min(startPage + maxPageButtons, totalPages);

    const canGoPrevSet = startPage > 0;
    const canGoNextSet = endPage < totalPages;

    const onPrevSet = () => {
        const targetPage = startPage - 1;
        onPageChange(targetPage);
    };

    const onNextSet = () => {
        const targetPage = endPage;
        onPageChange(targetPage);
    };

    const pageNumbers = [];
    for (let i = startPage; i < endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav aria-label="Page navigation" className="mt-8">
            <ul className="flex flex-wrap justify-center gap-2 sm:space-x-3">
                {/* 이전 그룹 버튼 */}
                {canGoPrevSet && (
                    <li>
                        <button
                            onClick={onPrevSet}
                            className="w-9 h-9 flex items-center justify-center font-medium text-gray-500 hover:text-yellow-500 transition-colors duration-200 focus:outline-none"
                            aria-label="Previous page group"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    </li>
                )}

                {/* 페이지 번호들 */}
                {pageNumbers.map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                        <li key={pageNum}>
                            <button
                                onClick={() => onPageChange(pageNum)}
                                aria-current={isActive ? "page" : undefined}
                                className={`px-4 py-2 font-medium relative transition-colors duration-200 ${
                                    isActive
                                        ? "text-gray-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-yellow-500"
                                        : "text-gray-500 hover:text-gray-600"
                                } focus:outline-none`}
                            >
                                {pageNum + 1}
                            </button>
                        </li>
                    );
                })}

                {/* 다음 그룹 버튼 */}
                {canGoNextSet && (
                    <li>
                        <button
                            onClick={onNextSet}
                            className="w-9 h-9 flex items-center justify-center font-medium text-gray-500 hover:text-yellow-500 transition-colors duration-200 focus:outline-none"
                            aria-label="Next page group"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default PaginationComponent;