import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { PagingResponse } from "~/types/common";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import ListComponent from "~/components/inquiries/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { fetchInquiries } from "~/api/inquiriesAPI";

const FIXED_PAGE_SIZE = 5;

function ListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = Number(searchParams.get("page") || "0"); // ⚠️ 0-based index

    const { data, isLoading, isError } = useQuery<PagingResponse<InquiryResponseDTO>>({
        queryKey: ["inquiries", page],
        queryFn: () => fetchInquiries({ page, size: FIXED_PAGE_SIZE }),
        staleTime: 1000 * 60 * 10,
    });

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: String(newPage) });
    };

    if (isLoading) return <LoadingComponent isLoading />;
    if (isError || !data)
        return <div className="p-4 text-red-500">데이터를 불러오지 못했습니다.</div>;

    return (
        <div>
            <ListComponent
                items={data.content}
                currentPage={page + 1} // ✅ 사용자 시점에서 1-based 인덱스 전달
                pageSize={FIXED_PAGE_SIZE} // ✅ 실제 사용된 페이지 크기 전달
                totalCount={data.totalElements}
            />
            <PaginationComponent
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
                maxPageButtons={5}
            />
            <BottomNavComponent />
        </div>
    );
}

export default ListPage;