import { useSearchParams } from "react-router";
import { useState } from "react";
import { useQuery} from "@tanstack/react-query";
import type { PagingResponse } from "~/types/common";
import { getAdminReviewReportList } from "~/api/reviews/adminReviewAPI";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag } from "@fortawesome/free-solid-svg-icons";
import FilterBar from "~/components/admin/reports/reportFilterBar";
import ListComponent from "~/components/admin/reports/listComponent";
import PaginationComponent from "~/components/common/PaginationComponent";

function ListPage() {
    const [searchParamsUrl] = useSearchParams();

    // 초기값 설정
    const initialCategory = searchParamsUrl.get("category") || "all";
    const initialKeyword = searchParamsUrl.get("keyword") || "";
    const initialPage = Number(searchParamsUrl.get("page") || "0");

    // 필터링 타입과 키워드
    const [category, setCategory] = useState(initialCategory);
    const [keyword, setKeyword] = useState(initialKeyword);

    // 페이지 번호
    const [page, setPage] = useState(initialPage);

    // 실제 쿼리 요청 r값
    const [searchParams, setSearchParams] = useState({ category: initialCategory, keyword: initialKeyword });

    // 검색 버튼 핸들링
    const handleSearch = () => {
        setSearchParams({ category, keyword });
        setPage(0);
    };

    // 리뷰 리스트  - 페이지별
    const { data, isLoading, isError } = useQuery<PagingResponse<AdminReviewReportDTO>>({
        queryKey: ["adminReviewReportList", page, searchParams],
        queryFn: () => getAdminReviewReportList(page, searchParams.category, searchParams.keyword),
    });

    if (isLoading) return <div className="p-4 text-gray-600">Loading...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">An error occurred</div>;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faFlag} /> 리뷰 신고 관리
            </h3>

            {/* 검색 바 */}
            <FilterBar
                category={category} setCategory={setCategory}
                keyword={keyword} setKeyword={setKeyword}
                onSearch={handleSearch}
            />

            {/* 검색 결과 리뷰 리스트 */}
            <ListComponent
                data={data.content} page={page}
                category={category} keyword={keyword}
            />

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

export default ListPage