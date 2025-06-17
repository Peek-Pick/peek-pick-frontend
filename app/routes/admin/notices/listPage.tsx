import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import type { NoticePageDTO } from "~/types/notice";
import { fetchNotices } from "~/api/notices/adminNoticesAPI";
import NoticeListComponent from "~/components/admin/notices/listComponent";

export default function ListPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(0); // 0-based
    const size = 10;

    const { data, isLoading, isError } = useQuery<NoticePageDTO>({
        queryKey: ["adminNotices", page, size],
        queryFn: () => fetchNotices(page, size),
    });

    if (isLoading)
        return <div className="p-4 text-gray-600">불러오는 중...</div>;
    if (isError || !data)
        return <div className="p-4 text-red-500">공지사항을 불러오는 중 오류 발생</div>;

    return (
        <div>
            <NoticeListComponent
                notices={data.content}
                page={data.number}
                setPage={setPage}
                size={data.size}
                totalElements={data.totalElements}
            />
        </div>
    );
}
