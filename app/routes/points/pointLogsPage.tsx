import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {PointLogsDTO} from "~/types/points";
import {userPointLogs} from "~/api/points/pointsAPI";
import PointLogsComponent from "~/components/points/pointLogsComponent";
import type {PagingResponse} from "~/types/common";
import PaginationComponent from "~/components/common/PaginationComponent";


function PointLogPage() {
    const [page, setPage] = useState(0); // 0-based
    const size = 10;
    const sort = "pointLogId";

    const { data, isLoading, isError } = useQuery<PagingResponse<PointLogsDTO>>({
        queryKey: ["pointLogs", page, size, sort],
        queryFn: () => userPointLogs(page, size, sort),
    });

    if (isLoading) return <div className="p-4 text-gray-600">Loading...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">An error occurred</div>;

    console.log("포인트 내역 데이터", data);

    return (
        <>
            <PointLogsComponent
                pointLogs={data.content}
            />

            {/* 페이지네이션 컴포넌트 */}
            <PaginationComponent
                currentPage={data.number}
                totalPages={data.totalPages}
                onPageChange={setPage}
                maxPageButtons={5}
            />
        </>
    );
}

export default PointLogPage;