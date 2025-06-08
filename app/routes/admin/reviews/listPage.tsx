import ListComponent from "~/components/admin/reviews/listComponent";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PagingResponse} from "~/types/common";
import { getAdminReviewList } from "~/api/reviews/adminReviewAPI";
import PaginationComponent from "~/components/common/PaginationComponent";

function ListPage() {
    const [page, setPage] = useState(0);

    const { data, isLoading, isError } = useQuery<PagingResponse<AdminReviewSimpleDTO>>({
        queryKey: ["adminReviewList", page],
        queryFn: () => getAdminReviewList(page)
    });

    if (isLoading) return <div className="p-4 text-gray-600">Loading...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">An error occurred</div>;

    return (
        <div>
            <ListComponent data={data.content}/>

            {/* 페이지네이션 컴포넌트 추가 */}
            <PaginationComponent
                currentPage={page}
                totalPages={data?.totalPages}
                onPageChange={setPage}
                maxPageButtons={10}
            />
        </div>
    );
}

export default ListPage;