import { useNavigate } from "react-router";
import type { NoticeResponseDto } from "~/types/notice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";

interface Props {
    notices: NoticeResponseDto[];
    page: number;
    size: number;
    totalElements: number;
    setPage: (page: number) => void;
}

export default function NoticeListComponent({
                                          notices,
                                          page,
                                          size,
                                          totalElements,
                                          setPage,
                                      }: Props) {
    const navigate = useNavigate();

    const totalPages = Math.ceil(
        (Number.isFinite(totalElements) && totalElements >= 0 ? totalElements : 0) /
        (Number.isFinite(size) && size > 0 ? size : 1)
    );

    const onPageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
    };

    return (
        <div>
            {/* 헤더: 아이콘 + 타이틀 */}
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faBullhorn} />
                공지사항 관리
            </h3>

            {/* 새 글 작성 버튼 */}
            <div className="max-w-7xl mx-auto px-4 mb-4 flex justify-end">
                <button
                    onClick={() => navigate("/admin/notices/add")}
                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 transition"
                >
                    {/* + 아이콘 (SVG 그대로 복사) */}
                    <svg
                        className="w-4 h-4"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9 2C9.55228 2 10 2.44772 10 3V8H15C15.5523 8 16 8.44772 16 9C16 9.55228 15.5523 10 15 10H10V15C10 15.5523 9.55228 16 9 16C8.44772 16 8 15.5523 8 15V10H3C2.44772 10 2 9.55228 2 9C2 8.44772 2.44772 8 3 8H8V3C8 2.44772 8.44772 2 9 2Z"
                            fill="currentColor"
                        />
                    </svg>
                    새 공지 작성
                </button>
            </div>

            {/* 테이블 */}
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            제목
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            등록일
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {notices.length === 0 ? (
                        <tr>
                            <td
                                colSpan={3}
                                className="px-4 py-3 text-center text-gray-500"
                            >
                                등록된 공지사항이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        notices.map((n) => (
                            <tr
                                key={n.noticeId}
                                className="hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() =>
                                    navigate(`/admin/notices/${n.noticeId}`)
                                }
                            >
                                <td className="px-6 py-4">{n.noticeId}</td>
                                <td className="px-4 py-2">{n.title}</td>
                                <td className="px-4 py-2">
                                    {n.regDate.slice(0, 10).replace(/-/g, ".")}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* 페이징 (포인트 상점과 동일) */}
            <nav aria-label="Page navigation" className="mt-8">
                <ul className="flex justify-center space-x-3">
                    {/* 이전 */}
                    <li>
                        <button
                            type="button"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 0}
                            className={`
                w-9 h-9 flex items-center justify-center 
                font-medium text-gray-500 transition-colors duration-200 relative 
                ${
                                page === 0
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:text-blue-600"
                            }
                focus:outline-none
              `}
                            aria-disabled={page === 0}
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

                    {/* 페이지 번호 */}
                    {[...Array(totalPages)].map((_, i) => {
                        const isActive = i === page;
                        return (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => onPageChange(i)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`
                    px-4 py-2 font-medium relative transition-colors duration-200
                    ${
                                        isActive
                                            ? "text-blue-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-blue-600"
                                            : "text-gray-500 hover:text-blue-600"
                                    }
                    focus:outline-none
                  `}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        );
                    })}

                    {/* 다음 */}
                    <li>
                        <button
                            type="button"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages - 1}
                            className={`
                w-9 h-9 flex items-center justify-center 
                font-medium text-gray-500 transition-colors duration-200 relative 
                ${
                                page === totalPages - 1
                                    ? "cursor-not-allowed opacity-50"
                                    : "hover:text-blue-600"
                            }
                focus:outline-none
              `}
                            aria-disabled={page === totalPages - 1}
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
        </div>
    );
}
