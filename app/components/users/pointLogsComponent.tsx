import type { PointLogsDTO } from "~/types/points";
import {PointLogsDesc, PointLogsType} from "~/enums/points/points";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine } from '@fortawesome/free-solid-svg-icons'

interface Props {
    pointLogs: PointLogsDTO[];
    page: number;
    size: number;
    totalElements: number;
    setPage: (page: number) => void;
}

export default function PointLogsComponent({
                                               pointLogs,
                                               page,
                                               size,
                                               totalElements,
                                               setPage,
                                           }: Props) {
    const totalPages = Math.ceil(
        (Number.isFinite(totalElements) && totalElements >= 0 ? totalElements : 0) /
        (Number.isFinite(size) && size > 0 ? size : 1)
    );

    const onPageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
    };

    // description 및 type enum-safe 변환 함수
    const getDescription = (descKey: string) => {
        return PointLogsDesc[descKey as keyof typeof PointLogsDesc] ?? descKey;
    };

    const getTypeText = (typeKey: string) => {
        return PointLogsType[typeKey as keyof typeof PointLogsType] ?? typeKey;
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
                <FontAwesomeIcon icon={faChartLine} /> Point History
            </h3>

            <ul className="space-y-4">
                {pointLogs.length === 0 ? (
                    <li className="text-center text-gray-400 text-sm sm:text-base">
                        No point history available.
                    </li>
                ) : (
                    pointLogs.map((log) => (
                        <li
                            key={log.pointLogId}
                            className={`border-l-4 pl-4 p-4 rounded-lg shadow-sm bg-gray-50 ${
                                log.type === "EARN"
                                    ? "border-green-300"
                                    : log.type === "USE"
                                        ? "border-red-300"
                                        : "border-gray-300"
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {getDescription(log.description)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(log.regDate).toLocaleString()} •{" "}
                                        <span className="text-gray-500">{getTypeText(log.type)}</span>
                                    </p>
                                </div>
                                <div>
                                      <span
                                          className={`inline-block px-3 py-1 rounded-full font-semibold text-sm shadow-sm ${
                                              log.type === "EARN"
                                                  ? "bg-green-100 text-green-600"
                                                  : log.type === "USE"
                                                      ? "bg-red-100 text-red-500"
                                                      : "bg-gray-100 text-gray-400"
                                          }`}
                                      >
                                            {log.type === "EARN" ? "+" : "-"}
                                      {log.amount.toLocaleString()}P
                                      </span>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>


            {/*페이지네이션*/}
            <nav aria-label="Page navigation" className="mt-8">
                <ul className="flex justify-center space-x-3">
                    {/* 이전 버튼 */}
                    <li>
                        <button
                            type="button"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 0}
                            className={`
                            w-9 h-9 flex items-center justify-center
                            font-medium text-gray-500 transition-colors duration-200 relative
                            ${page === 0 ? "cursor-not-allowed opacity-50" : "hover:text-blue-600"}
                            focus:outline-none
                            `}
                            aria-disabled={page === 0}
                            aria-label="Previous page"
                        >
                            {/* 왼쪽 화살표 SVG */}
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

                    {/* 페이지네이션 */}
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
                                            ? "text-gray-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-green-600"
                                            : "text-gray-500 hover:text-gray-600"
                                    }
                                    focus:outline-none
                                    `}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        );
                    })}

                    {/* 다음 버튼 */}
                    <li>
                        <button
                            type="button"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages - 1}
                            className={`
                            w-9 h-9 flex items-center justify-center
                            font-medium text-gray-500 transition-colors duration-200 relative
                            ${page === totalPages - 1 ? "cursor-not-allowed opacity-50" : "hover:text-blue-600"}
                            focus:outline-none
                            `}
                            aria-disabled={page === totalPages - 1}
                            aria-label="Next page"
                        >
                            {/* 오른쪽 화살표 SVG */}
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
