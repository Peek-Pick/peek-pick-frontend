import ListComponent from "~/components/admin/reviews/listComponent";
import {useEffect, useState} from "react";
import { useQuery } from "@tanstack/react-query";
import type { PagingResponse } from "~/types/common";
import { getAdminReviewList } from "~/api/reviews/adminReviewAPI";
import PaginationComponent from "~/components/common/PaginationComponent";
import FilterBar from "~/components/admin/reviews/reviewFilterBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "react-router";

function ListPage() {
    const [searchParamsUrl, setSearchParamsURL] = useSearchParams();

    // 초기값 설정
    const initialCategory = searchParamsUrl.get("category") || "all";
    const initialKeyword = searchParamsUrl.get("keyword") || "";
    const initialPage = Number(searchParamsUrl.get("page") || "0");
    const initialHidden = searchParamsUrl.get("hidden") === "true";

    // 카테고리, 키워드, 페이지, 숨김여부 상태 관리
    const [category, setCategory] = useState(initialCategory);
    const [inputKeyword, setInputKeyword] = useState(initialKeyword);
    const [keyword, setKeyword] = useState(initialKeyword);
    const [page, setPage] = useState(initialPage);
    const [hidden, setHidden] = useState(initialHidden);

    // 뒤로가기, 앞으로가기 URL 변경 감지
    useEffect(() => {
        const newCategory = searchParamsUrl.get("category") || "all";
        const newKeyword = searchParamsUrl.get("keyword") || "";
        const newPage = Number(searchParamsUrl.get("page") || "0");
        const newHidden = searchParamsUrl.get("hidden") === "true";

        setCategory(newCategory);
        setKeyword(newKeyword);
        setInputKeyword(newKeyword);
        setPage(newPage);
        setHidden(newHidden);
    }, [searchParamsUrl]);

    // 숨겨진 리뷰 체크박스 핸들러
    const handleHiddenToggle = (value: boolean) => {
        setSearchParamsURL({category, keyword, hidden: value.toString(), page: "0"})
        setHidden(value);
        setPage(0);
    };

    // 검색 버튼 핸들링
    const handleSearch = () => {
        setSearchParamsURL({category, keyword: inputKeyword, hidden: hidden.toString(), page: "0"})
        setKeyword(inputKeyword)
        setPage(0);
    };

    // 검색 버튼 핸들링
    const handlePage = (page: number) => {
        setSearchParamsURL({category, keyword, hidden: hidden.toString(), page: page.toString()})
        setPage(page);
    };

    // 리뷰 리스트  - 페이지별
    const { data, isLoading, isError } = useQuery<PagingResponse<AdminReviewSimpleDTO>>({
        queryKey: ["adminReviewList", page, page, category, keyword, hidden],
        queryFn: () => getAdminReviewList(page, category, keyword, hidden),
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) return <div className="p-4 text-gray-600">Loading...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">An error occurred</div>;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faStar} /> 리뷰 관리
            </h3>

            {/* 검색 바 */}
            <FilterBar
                category={category} setCategory={setCategory}
                keyword={inputKeyword} setKeyword={setInputKeyword}
                hidden={hidden} setHidden={handleHiddenToggle}
                onSearch={handleSearch}
            />

            {/* 검색 결과 리뷰 리스트 */}
            <ListComponent
                data={data.content} page={page}
                category={category} keyword={keyword} hidden={hidden}
            />

            {/* 페이지네이션 컴포넌트 추가 */}
            <PaginationComponent
                currentPage={page}
                totalPages={data?.totalPages}
                onPageChange={handlePage}
                maxPageButtons={10}
            />
        </div>
    );
}

export default ListPage;