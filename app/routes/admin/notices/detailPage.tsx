// src/pages/admin/notices/detailPage.tsx

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { NoticeResponseDto } from "~/types/notice";
import { fetchNotice } from "~/api/noticeAPI";
import DetailComponent from "~/components/admin/notices/detailComponent";

export default function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [notice, setNotice] = useState<NoticeResponseDto | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const loadNotice = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetchNotice(Number(id));
            setNotice(res.data);
        } catch (e) {
            console.error(e);
            setError("공지사항 정보를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotice();
        // eslint-disable-next-line
    }, [id]);

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!notice) return <p>존재하지 않는 공지사항입니다.</p>;

    return (
        <div className="p-6">
            <DetailComponent notice={notice} navigate={navigate} />
        </div>
    );
}
