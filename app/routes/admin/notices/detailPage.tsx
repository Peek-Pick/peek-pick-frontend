import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { NoticeResponseDto } from "~/types/notice";
import { fetchNotice } from "~/api/notices/adminNoticesAPI";
import NoticeDetailComponent from "~/components/admin/notices/detailComponent";

export default function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const [notice, setNotice] = useState<NoticeResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);

        fetchNotice(Number(id))
            .then((res) => {
                setNotice(res);
            })
            .catch(() => {
                setError("공지사항 정보를 불러오는 중 오류가 발생했습니다.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 text-gray-800 max-w-4xl mx-auto">
            <NoticeDetailComponent notice={notice} isLoading={loading} error={error}/>
        </div>
    );
}
