// src/components/notices/detailComponent.tsx
import { useNavigate } from "react-router-dom";
import type { NoticeDetailDTO } from "~/types/notice";

const rawApi = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";
const API_HOST = rawApi
    .replace("http://localhost:8080/api/v1", "http://localhost")
    .replace("https://localhost:8080/api/v1", "https://localhost");

interface Props {
    notice: NoticeDetailDTO;
}

export default function NoticeDetailComponent({ notice }: Props) {
    const navigate = useNavigate();
    const dateStr = new Date(notice.regDate).toLocaleDateString();

    return (
        <>
            {/* 뒤로가기 버튼 */}
            <button
                onClick={() => {
                    if (window.history.length > 1) navigate(-1);
                    else navigate("/notices/list");
                }}
                className="text-gray-500 hover:text-gray-700 mb-4 p-1"
                aria-label="뒤로가기"
            >
                <svg
                    className="w-6 h-6 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>

            {/* 제목 */}
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {notice.title}
            </h1>

            {/* 작성일 */}
            <time className="text-sm text-gray-400 block mb-6">
                {dateStr}
            </time>

            {/* 구분선 */}
            <hr className="border-t border-gray-200 mb-6" />

            {/* 이미지 */}
            {notice.imgUrls.length > 0 && (
                <div className="flex flex-col gap-4 mb-6">
                    {notice.imgUrls.map((url) => {
                        const src = url.startsWith("http") ? url : API_HOST + url;
                        return (
                            <img
                                key={url}
                                src={src}
                                alt="공지 이미지"
                                className="w-full rounded-lg"
                                onError={(e) => {
                                    e.currentTarget.src = "";
                                }}
                            />
                        );
                    })}
                </div>
            )}

            {/* 본문 */}
            <div className="whitespace-pre-line leading-relaxed text-gray-800">
                {notice.content}
            </div>
        </>
    );
}
