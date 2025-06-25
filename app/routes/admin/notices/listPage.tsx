import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn } from "@fortawesome/free-solid-svg-icons";
import type { NoticePageDTO } from "~/types/notice";
import { fetchNotices } from "~/api/notices/adminNoticesAPI";
import NoticeListComponent from "~/components/admin/notices/listComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import NoticeFilterBar from "~/components/admin/notices/noticeFilterBar";

export default function ListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || "0");
    const size = searchParams.get("size") || "10";
    const keyword = searchParams.get("keyword") || "";
    const category = searchParams.get("category") || "title";

    const [selectedCategory, setSelectedCategory] = useState(category);

    const handleSearch = (kw: string) => {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", size);
        if (kw) params.set("keyword", kw);
        if (selectedCategory) params.set("category", selectedCategory);
        setSearchParams(params);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        setSearchParams(params);
    };

    const queryParams = useMemo(() => ({
        page,
        size: Number(size),
        keyword: keyword.trim() || undefined,
        category,
    }), [page, size, keyword, category]);

    const { data, isLoading, isError } = useQuery<NoticePageDTO>({
        queryKey: ["admin-notices", queryParams],
        queryFn: () => fetchNotices(queryParams),
        staleTime: 1000 * 60 * 10,
    });

    return (
        <div>
            {/* 📄 타이틀 */}
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faBullhorn} style={{ width: '20px', height: '20px' }}/>
                공지사항 관리
            </h3>

            {/* 🔍 필터바 */}
            <NoticeFilterBar
                keyword={keyword}
                category={selectedCategory}
                setCategory={setSelectedCategory}
                onSearch={handleSearch}
            />

            {/* 📋 리스트 */}
            <NoticeListComponent
                notices={data?.content}
                isLoading={isLoading}
                isError={isError}
                page={page}
                size={Number(size)}
                totalElements={data?.totalElements}
                setPage={handlePageChange}
            />

            {/* 📦 페이지네이션 */}
            <PaginationComponent
                currentPage={page}
                totalPages={data?.totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
