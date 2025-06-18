// src/components/admin/notices/detailComponent.tsx

import { Link } from "react-router-dom";
import type { NoticeResponseDto } from "~/types/notice";

// VITE_API_URL에서 "/api/v1" 제거하여 정적 파일 호스트만 남깁니다.
const rawApi =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";
const API_URL = rawApi
    .replace("http://localhost:8080/api/v1", "http://localhost")
    .replace("https://localhost:8080/api/v1", "https://localhost");

interface Props {
    notice: NoticeResponseDto;
}

export default function NoticeDetailComponent({ notice }: Props) {
    const formattedDate = new Date(notice.regDate).toLocaleString();

    const infoBlocks = [
        { label: "제목", value: notice.title, isContent: false },
        { label: "DATE", value: formattedDate, isContent: false },
        { label: "내용", value: notice.content, isContent: true },
    ];

    return (
        <>
            {/* 고정 헤더 */}
            <h2 className="text-xl font-bold mb-6 border-b pb-2">
                공지사항
            </h2>

            {/* 제목 / 날짜 / 내용(이미지+텍스트) 카드 */}
            <div className="flex flex-col gap-6 mb-6 w-full">
                {infoBlocks.map(({ label, value, isContent }, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 w-full"
                        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                    >
                        <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                            {label}
                        </h3>

                        {isContent ? (
                            <div className="space-y-4">
                                {/* 이미지 먼저 */}
                                {Array.isArray(notice.imgUrls) &&
                                    notice.imgUrls
                                        .filter((url): url is string =>
                                            typeof url === "string" && url.trim() !== ""
                                        )
                                        .map((url) => {
                                            const fullUrl = url.startsWith("http")
                                                ? url
                                                : `${API_URL}${url}`;
                                            return (
                                                <div
                                                    key={url}
                                                    className="flex justify-center"
                                                >
                                                    <img
                                                        src={fullUrl}
                                                        alt="공지 이미지"
                                                        className="max-w-full h-auto rounded"
                                                        style={{ maxWidth: "80%" }}
                                                        onError={(e) => {
                                                            e.currentTarget.src = "";
                                                        }}
                                                    />
                                                </div>
                                            );
                                        })}

                                {/* 그 아래 텍스트 */}
                                <p className="text-gray-900 whitespace-pre-line leading-relaxed" style={{ fontSize: "0.9rem" }}>
                                    {value}
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-900 font-medium">
                                {value}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* 액션 버튼 */}
            <div className="mt-8 flex gap-3 justify-end">
                <Link
                    to={`/admin/notices/${notice.noticeId}/edit`}
                    className="flex items-center gap-1 rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-100 hover:text-blue-800 transition"
                >
                    수정
                </Link>
                <Link
                    to="/admin/notices/list"
                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 transition"
                >
                    목록으로
                </Link>
            </div>
        </>
    );
}
