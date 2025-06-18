import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { fetchNotice } from "~/api/notices/noticesAPI";
import type { NoticeDetailDTO } from "~/types/notice";
import NoticeDetailComponent from "~/components/notices/detailComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";

export default function NoticeDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [notice, setNotice] = useState<NoticeDetailDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchNotice(Number(id))
            .then((dto) => setNotice(dto))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <LoadingComponent isLoading />;
    if (error)
        return (
            <div className="p-4 text-red-500">
                조회 중 오류가 발생했습니다.
            </div>
        );
    if (!notice)
        return <div className="p-4">존재하지 않는 공지사항입니다.</div>;

    return (
        <div className="bg-gray-50 flex justify-center pb-20">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl px-4 md:px-8 py-6">
                <NoticeDetailComponent notice={notice} />

                {/* 하단 버튼: 목록으로 */}
                <div className="mt-10 flex justify-end">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white border border-gray-300 text-gray-700 text-sm px-4 py-2 rounded shadow-sm hover:bg-gray-100 transition"
                    >
                        목록으로
                    </button>
                </div>
            </div>
            <BottomNavComponent />
        </div>
    );
}
