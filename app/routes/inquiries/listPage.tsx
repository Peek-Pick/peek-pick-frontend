import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchInquiries } from "~/api/inquiriesAPI";
import type { InquiryResponseDTO } from "~/types/inquiries";
import type { PagingResponse } from "~/types/common";
import ListComponent from "~/components/inquiries/listComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";

function ListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || "0");
    const size = Number(searchParams.get("size") || "10");

    const { data, isLoading, isError } = useQuery<PagingResponse<InquiryResponseDTO>>({
        queryKey: ["inquiries", page, size],
        queryFn: () => fetchInquiries(page, size).then((res) => res.data),
        staleTime: 1000 * 60 * 10, // 10분
    });

    const handleSizeChange = (newSize: number) => {
        // size 바꾸면 page는 0으로 초기화
        setSearchParams({ page: "0", size: String(newSize) });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({ page: String(newPage), size: String(size) });
    };

    if (isLoading) return <LoadingComponent isLoading />;
    if (isError || !data)
        return <div className="p-4 text-red-500">데이터를 불러오지 못했습니다.</div>;

    return (
        <div className="bg-gray-50 flex flex-col justify-between">
            <main>
                <ListComponent
                    items={data.content}
                    size={size}
                    onSizeChange={handleSizeChange}
                />
                <div className="mt-4">
                    <PaginationComponent
                        currentPage={page}
                        totalPages={data.totalPages}
                        onPageChange={handlePageChange}
                        maxPageButtons={5}
                    />
                </div>
            </main>

            <BottomNavComponent />
        </div>
    );
}

export default ListPage;