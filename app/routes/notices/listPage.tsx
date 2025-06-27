import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchNotices } from "~/api/notices/noticesAPI";
import type { NoticePageDTO } from "~/types/notice";
import NoticeListComponent from "~/components/notices/listComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import { BackButton } from "~/util/button/FloatingActionButtons";

export default function NoticeListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || "0");
    const size = 10;

    const { data, isLoading, isError } = useQuery<NoticePageDTO>({
        queryKey: ["notices", page],
        queryFn: () => fetchNotices(page, size),
        // staleTime: 1000 * 60 * 10,
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
        <div>
            <NoticeListComponent items={data.content} />

            <PaginationComponent
                currentPage={data.number}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
                maxPageButtons={5}
            />

            <BackButton />
        </div>
    );
}
