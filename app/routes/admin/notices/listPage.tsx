// src/pages/admin/notices/listPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { NoticeResponseDto, NoticePageDto } from "~/types/notice";
import { fetchNotices, deleteNotice } from "~/api/noticeAPI";

export default function ListPage() {
    const navigate = useNavigate();

    const [notices, setNotices] = useState<NoticeResponseDto[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [pageSize] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadNotices = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchNotices();
            const data: NoticePageDto = res.data;
            setNotices(data.content);
            setTotalPages(data.totalPages);
        } catch (e) {
            console.error(e);
            setError("공지사항 목록을 가져오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotices();
    }, [currentPage]);

    const handleDelete = async (id: number) => {
        if (!window.confirm("정말 해당 공지사항을 삭제하시겠습니까?")) return;
        try {
            await deleteNotice(id);
            loadNotices();
        } catch (e) {
            console.error(e);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">공지사항 목록</h1>

            <button
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => navigate("/admin/notices/add")}
            >
                새 공지 작성
            </button>

            {loading && <p>로딩 중...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <table className="min-w-full border">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">제목</th>
                        <th className="border px-4 py-2">등록일</th>
                        <th className="border px-4 py-2">수정일</th>
                        <th className="border px-4 py-2">액션</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notices.map((notice) => (
                        <tr key={notice.noticeId}>
                            <td className="border px-4 py-2">{notice.noticeId}</td>
                            <td className="border px-4 py-2">
                                <Link
                                    className="text-blue-600 hover:underline"
                                    to={`/admin/notices/${notice.noticeId}`}
                                >
                                    {notice.title}
                                </Link>
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(notice.regDate).toLocaleString("ko-KR")}
                            </td>
                            <td className="border px-4 py-2">
                                {new Date(notice.modDate).toLocaleString("ko-KR")}
                            </td>
                            <td className="border px-4 py-2 space-x-2">
                                <button
                                    className="px-2 py-1 bg-green-500 text-white rounded text-sm"
                                    onClick={() =>
                                        navigate(`/admin/notices/${notice.noticeId}/edit`)
                                    }
                                >
                                    수정
                                </button>
                                <button
                                    className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                                    onClick={() => handleDelete(notice.noticeId)}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    {notices.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center py-4">
                                등록된 공지사항이 없습니다.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            )}

            {!loading && !error && totalPages > 1 && (
                <div className="mt-4 flex justify-center items-center space-x-3">
                    <button
                        className={`px-3 py-1 border rounded ${
                            currentPage === 0
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 0}
                    >
                        이전
                    </button>
                    <span>
            {currentPage + 1} / {totalPages}
          </span>
                    <button
                        className={`px-3 py-1 border rounded ${
                            currentPage + 1 >= totalPages
                                ? "bg-gray-200 cursor-not-allowed"
                                : "bg-white hover:bg-gray-50"
                        }`}
                        onClick={() =>
                            currentPage + 1 < totalPages &&
                            setCurrentPage(currentPage + 1)
                        }
                        disabled={currentPage + 1 >= totalPages}
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}
