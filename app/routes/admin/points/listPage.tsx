import ListComponent from "~/components/admin/points/listComponent";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type {PointStoreListDTO} from "~/types/points";
import PaginationComponent from "~/components/common/PaginationComponent";
import type {PagingResponse} from "~/types/common";
import {listAdminCoupon} from "~/api/points/adminPointsAPI";


function ListPage() {
    const [page, setPage] = useState(0); // 0-based
    const size = 10;
    const sort = "pointstoreId";

    const { data, isLoading, isError } = useQuery<PagingResponse<PointStoreListDTO>>({
        queryKey: ["points", page, size],
        queryFn: () => listAdminCoupon(page, size, sort),
        staleTime: 1000 * 60 * 5
    });

    console.log("API 응답 확인:", data);

    if (isLoading) return <div className="p-4 text-gray-600">불러오는 중...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;

    return (
        <div>
            <ListComponent
                products={data.content}
            />

            {/* 페이지네이션 컴포넌트 */}
            <PaginationComponent
                currentPage={data.number}
                totalPages={data.totalPages}
                onPageChange={setPage}
                maxPageButtons={10}
            />
        </div>
    );
}

export default ListPage;