import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type {PointLogsDTO} from "~/types/points";
import {userPointLogs} from "~/api/points/pointsAPI";
import PointLogsComponent from "~/components/points/pointLogsComponent";
import type {PagingResponse} from "~/types/common";
import PaginationComponent from "~/components/common/PaginationComponent";
import PointsLoading from "~/util/loading/pointsLoading";
import {BackButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";


function PointLogPage() {
    const [page, setPage] = useState(0); // 0-based
    const size = 10;
    const sort = "pointLogId,desc";

    const { data, isLoading, isError } = useQuery<PagingResponse<PointLogsDTO>>({
        queryKey: ["pointLogs", page, size, sort],
        queryFn: () => userPointLogs(page, size, sort),
    });

    // 로딩, 에러 처리
    if (isLoading) return <PointsLoading />;
    if (isError || !data) return "Error";

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

            {/*<BottomNavComponent />*/}
            <BackButton />

            <FloatingActionButtons />
        </>
    );
}

export default PointLogPage;