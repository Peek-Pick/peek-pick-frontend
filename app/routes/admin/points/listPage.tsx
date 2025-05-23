import ListComponent from "~/components/admin/points/listComponent";
import { useQuery } from "@tanstack/react-query";
import { listCoupon } from "~/api/points/pointsAPI";
import { useState } from "react";
import type { PointStoreListDTO } from "~/types/points/points";

interface PageResponse<T> {
    content: T[];
    total_elements: number;
    total_pages: number;
    size: number;
    number: number;
}

function ListPage() {
    const [page, setPage] = useState(0); // 0-based
    const size = 10;
    const sort = "pointstoreId";

    const { data, isLoading, isError } = useQuery<PageResponse<PointStoreListDTO>>({
        queryKey: ["points", page, size],
        queryFn: () => listCoupon(page, size, sort)
    });

    console.log("API 응답 확인:", data);

    if (isLoading) return <div className="p-4 text-gray-600">불러오는 중...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;

    return (
        <div>
            <ListComponent
                products={data.content}
                page={data.number}
                setPage={setPage}
                size={data.size}
                totalElements={data.total_elements}
            />
        </div>
    );
}

export default ListPage;
