import { useEffect, useState } from "react";
import { fetchNotices, deleteNotice } from "~/api/notice";
import type { NoticeResponseDto, NoticePageDto } from "~/types/notice";
import { useNavigate } from "react-router-dom";

import ListComponent from "~/components/admin/notices/listComponent";

export default function ListPage() {
    // 반드시 빈 배열로 초기화
    const [items, setItems] = useState<NoticeResponseDto[]>([]);
    const nav = useNavigate();

    useEffect(() => {
        fetchNotices()
            .then(res => {
                // 전체 페이징 응답에서 실제 DTO 배열만 꺼내 setItems
                setItems(res.data.content);
            })
            .catch(console.error);
    }, []);

    async function handleDelete(id: number) {
        if (!confirm("삭제하시겠습니까?")) return;
        await deleteNotice(id);
        const r = await fetchNotices();
        setItems(r.data.content);
    }

    return (
        <div className="p-4">
            <h1>공지사항 목록</h1>
            <button onClick={() => nav("/admin/notices/add")}>추가</button>
            <ListComponent
                items={items}
                onEdit={id => nav(`/admin/notices/${id}/edit`)}
                onDelete={handleDelete}
            />
        </div>
    );
}
