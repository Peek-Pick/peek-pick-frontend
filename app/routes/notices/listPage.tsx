import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotices } from "~/api/notices/noticesAPI";
import type { NoticePageDTO } from "~/types/notice";
import NoticeListComponent from "~/components/notices/listComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";

export default function NoticeListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || "0");
    const size = 10;

    const { data, isLoading, isError } = useQuery<NoticePageDTO>({
        queryKey: ["notices", page],
        queryFn: () => fetchNotices(page, size),
        staleTime: 1000 * 60 * 10,
    });

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        setSearchParams(params);
    };

    if (isLoading) return <LoadingComponent isLoading />;
    if (isError || !data)
        return (
            <div className="p-4 text-red-500">
                공지사항을 불러오는 중 오류가 발생했습니다.
            </div>
        );

    return (
        <div className="bg-gray-50 flex justify-center pb-20">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl px-4 md:px-8 py-6">
                <NoticeListComponent items={data.content} />
                <div className="mt-6">
                    <PaginationComponent
                        currentPage={data.number}
                        totalPages={data.totalPages}
                        onPageChange={handlePageChange}
                        maxPageButtons={5}
                    />
                </div>
            </div>
            <BottomNavComponent />
        </div>
    );
}
