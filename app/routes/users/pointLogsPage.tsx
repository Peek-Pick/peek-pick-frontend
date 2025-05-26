import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {PointLogsDTO} from "~/types/points";
import {userPointLogs} from "~/api/points/pointsAPI";
import PointLogsComponent from "~/components/users/pointLogsComponent";

interface PageResponse<T> {
    content: T[];
    total_elements: number;
    total_pages: number;
    number: number;
    pageable: {
        page_size: number;
        page_number: number;
    };
}

function PointLogPage() {
    const [page, setPage] = useState(0); // 0-based
    const size = 10;
    const sort = "pointLogId";

    const { data, isLoading, isError } = useQuery<PageResponse<PointLogsDTO>>({
        queryKey: ["pointLogs", page, size, sort],
        queryFn: () => userPointLogs(page, size, sort),
    });

    if (isLoading) return <div className="p-4 text-gray-600">불러오는 중...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;

    console.log("포인트 내역 데이터", data);

    return (
        <PointLogsComponent
            pointLogs={data.content}
            page={data.number}
            setPage={setPage}
            size={data.pageable.page_size}
            totalElements={data.total_elements}
        />
    );
}

export default PointLogPage;