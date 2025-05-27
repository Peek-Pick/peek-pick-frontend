// src/app/routes/admin/notices/detailPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchNotice, deleteNotice } from "~/api/notice";
import type { NoticeResponseDto } from "~/types/notice";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function DetailPage() {
    // ① useParams 키 이름(id)이 라우트 정의와 일치해야 합니다.
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [notice, setNotice] = useState<NoticeResponseDto | null>(null);

    useEffect(() => {
        if (!id) return;
        const parsed = parseInt(id, 10);
        if (Number.isNaN(parsed)) return;
        fetchNotice(parsed)
            .then((res) => setNotice(res.data))
            .catch(console.error);
    }, [id]);

    if (!notice) {
        return <div className="p-4">로딩 중…</div>;
    }

    const onDelete = async () => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        await deleteNotice(notice.noticeId);
        nav("/admin/notices/list");
    };

    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">{notice.title}</h1>
            <p className="text-sm text-gray-600">
                등록: {new Date(notice.regDate).toLocaleString()}
            </p>
            <div>{notice.content}</div>

            <div className="flex space-x-2">
                {/* ② map 시 고유값(key) 사용 */}
                {notice.imgUrls.map((url) => (
                    <img
                        key={url}
                        src={`${API_URL}${url}`}
                        className="w-24 h-24 object-cover rounded"
                        alt={url}
                    />
                ))}
            </div>

            <div className="space-x-2">
                <button
                    onClick={() => nav(`/admin/notices/${notice.noticeId}/edit`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    수정
                </button>
                <button
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded"
                >
                    삭제
                </button>
            </div>

            <Link to="/admin/notices/list" className="text-gray-600">
                ← 목록으로
            </Link>
        </div>
    );
}
