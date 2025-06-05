// src/components/admin/notices/detailComponent.tsx

import type { NoticeResponseDto } from "~/types/notice";
import { deleteNotice } from "~/api/noticeAPI";
import { Link } from "react-router-dom";

// VITE_API_URL에서 "/api/v1" 부분을 제거하여 실제 정적 파일 호스트만 남깁니다.
const rawApi = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";
const API_URL = rawApi
    .replace("http://localhost:8080/api/v1", "http://localhost")
    .replace("https://localhost:8080/api/v1", "https://localhost");

interface Props {
    notice: NoticeResponseDto;
    navigate: (to: string) => void;
}

export default function DetailComponent({ notice, navigate }: Props) {
    const handleDelete = async () => {
        const ok = confirm("정말 삭제하시겠습니까?");
        if (!ok) return;
        await deleteNotice(notice.noticeId);
        navigate("/admin/notices/list");
    };

    const handleEdit = () => {
        navigate(`/admin/notices/${notice.noticeId}/edit`);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">{notice.title}</h1>
            <p className="text-sm text-gray-600">
                등록: {new Date(notice.regDate).toLocaleString()} | 수정:{" "}
                {new Date(notice.modDate).toLocaleString()}
            </p>
            <p>{notice.content}</p>

            {Array.isArray(notice.imgUrls) && notice.imgUrls.length > 0 && (
                <div className="flex flex-col space-y-4">
                    {notice.imgUrls
                        .filter((url): url is string => typeof url === "string" && url.trim() !== "")
                        .map((url) => {
                            const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;
                            return (
                                <div
                                    key={url}
                                    className="flex justify-center"
                                    style={{ width: "100%" }}
                                >
                                    <a
                                        href={fullUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block"
                                    >
                                        <img
                                            src={fullUrl}
                                            alt="첨부 이미지"
                                            style={{
                                                maxWidth: "80%",
                                                height: "auto",
                                            }}
                                            onError={(e) => {
                                                e.currentTarget.src = "";
                                            }}
                                        />
                                    </a>
                                </div>
                            );
                        })}
                </div>
            )}

            <div className="space-x-2">
                <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    수정
                </button>
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    삭제
                </button>
            </div>

            <div>
                <Link to="/admin/notices/list" className="text-gray-600">
                    ← 목록으로
                </Link>
            </div>
        </div>
    );
}
