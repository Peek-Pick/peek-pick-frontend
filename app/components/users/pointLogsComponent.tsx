import type { PointLogsDTO } from "~/types/points";
import {PointLogsDesc, PointLogsType} from "~/enums/points/points";

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

    const handlePageChange = (newPage: number) => {
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
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">📈 포인트 내역</h2>

            <ul className="space-y-4">
                {pointLogs.length === 0 ? (
                    <li className="text-center text-gray-400">포인트 내역이 없습니다.</li>
                ) : (
                    pointLogs.map((log) => (
                        <li
                            key={log.pointLogId}
                            className="border-l-4 pl-4 border-blue-400 bg-gray-50 p-4 rounded-lg shadow-sm"
                        >
                            <div className="flex justify-between items-start flex-col sm:flex-row">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {getDescription(log.description)}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(log.regDate).toLocaleString()} •{" "}
                                        <span className="text-gray-500">
                                            {getTypeText(log.type)}
                                        </span>
                                    </p>
                                </div>
                                <div className="mt-2 sm:mt-0 text-right">
                                    <p
                                        className={`text-lg font-bold ${
                                            log.type === "EARN"
                                                ? "text-green-500"
                                                : log.type === "USE"
                                                    ? "text-red-500"
                                                    : "text-gray-500"
                                        }`}
                                    >
                                        {log.type === "EARN" ? "+" : "-"}
                                        {log.amount.toLocaleString()}P
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>

            {/* 페이징 UI */}
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                    className="px-4 py-1.5 text-sm rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                    이전
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={`page-${i}`}
                        onClick={() => handlePageChange(i)}
                        className={`px-4 py-1.5 text-sm rounded-lg border ${
                            i === page
                                ? "bg-blue-400 text-white font-semibold"
                                : "bg-white hover:bg-gray-100 text-gray-700"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => handlePageChange(page + 1)}
                    className="px-4 py-1.5 text-sm rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40"
                >
                    다음
                </button>
            </div>
        </div>
    );
}
