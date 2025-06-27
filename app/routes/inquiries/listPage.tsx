import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { PagingResponse } from "~/types/common";
import PaginationComponent from "~/components/common/PaginationComponent";
import ListComponent from "~/components/inquiries/listComponent";
import { fetchInquiries } from "~/api/inquiries/inquiriesAPI";

const FIXED_PAGE_SIZE = 5;

function ListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || "0"); // 0-based index

    const { data, isLoading, isError } = useQuery<PagingResponse<InquiryResponseDTO>>({
        queryKey: ["inquiries", page],
        queryFn: () => fetchInquiries({ page, size: FIXED_PAGE_SIZE }),
        staleTime: 1000 * 60 * 10,
    });

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: String(newPage) });
    };

    return (
        <div>
            <ListComponent
                items={data?.content}
                isLoading={isLoading}
                isError={isError}
                currentPage={page + 1}
                pageSize={FIXED_PAGE_SIZE}
                totalCount={data?.totalElements}
            />
            <PaginationComponent
                currentPage={page}
                totalPages={data?.totalPages}
                onPageChange={handlePageChange}
                maxPageButtons={5}
            />
        </div>
    );
}

export default ListPage;