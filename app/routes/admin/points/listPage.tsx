import ListComponent from "~/components/admin/points/listComponent";
import { useQuery } from "@tanstack/react-query";
import {useEffect, useState} from "react";
import type {PointStoreListDTO} from "~/types/points";
import PaginationComponent from "~/components/common/PaginationComponent";
import type {PagingResponse} from "~/types/common";
import {listAdminCoupon} from "~/api/points/adminPointsAPI";
import {useSearchParams} from "react-router";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCartShopping} from "@fortawesome/free-solid-svg-icons";
import FilterBar from "~/components/admin/points/pointFilterBar";
import LoadingComponent from "~/components/common/loadingComponent";


function ListPage() {
    const [searchParamsUrl, setSearchParamsURL] = useSearchParams();

    // URL에서 초기 카테고리, 키워드, 페이지, 숨김 여부 값 읽어오기
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

    // 뒤로가기, 앞으로가기 URL 변경 감지 - URL 쿼리 파라미터가 변경될 때 상태들도 업데이트
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

    // 숨겨진 상품 체크박스 핸들러
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

    // 페이지 번호 변경 시 핸들링
    const handlePage = (page: number) => {
        setSearchParamsURL({category, keyword, hidden: hidden.toString(), page: page.toString()})
        setPage(page);
    };

    // 상품 리스트 가져오기
    const { data, isLoading, isError } = useQuery<PagingResponse<PointStoreListDTO>>({
        queryKey: ["pointsList", page, category, keyword, hidden],
        queryFn: () => listAdminCoupon(page, category, keyword, hidden),
        staleTime: 1000 * 60 * 5
    });

    console.log("API 응답 확인:", data);

    if (isLoading) return <LoadingComponent isLoading />;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                    icon={faCartShopping}
                    style={{ width: '20px', height: '20px' }}
                /> 포인트 상품 관리
            </h3>

            {/* 검색 바 */}
            <FilterBar
                category={category} setCategory={setCategory}
                keyword={inputKeyword} setKeyword={setInputKeyword}
                hidden={hidden} setHidden={handleHiddenToggle}
                onSearch={handleSearch}
            />

            <ListComponent
                products={data.content}
                page={page} category={category} keyword={keyword} hidden={hidden}
            />

            {/* 페이지네이션 컴포넌트 */}
            <PaginationComponent
                currentPage={data.number}
                totalPages={data.totalPages}
                onPageChange={handlePage}
                maxPageButtons={10}
            />
        </div>
    );
}

export default ListPage;