import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import type { PagingResponse } from "~/types/common";
import { fetchAdminInquiries } from "~/api/inquiriesAPI";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import ListComponent from "~/components/admin/inquiries/listComponent";
import InquiryFilterBar from "~/components/admin/inquiries/inquiryFilterBar";

function ListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    // URL에서 초기값 세팅
    const initPage = Number(searchParams.get("page") || "0");
    const initSize = searchParams.get("size") || "10";
    const initKeyword = searchParams.get("keyword") || "";
    const initCategory = searchParams.get("category") || "all";
    const initIsDeleted = searchParams.get("isDeleted") === "true";
    const initStatus = searchParams.get("status") || "";

    // 상태 관리 (필터, 페이지, 사이즈 등)
    const [page, setPage] = useState(initPage);
    const [size, setSize] = useState(initSize);
    const [keyword, setKeyword] = useState(initKeyword);
    const [category, setCategory] = useState(initCategory);
    const [isDeleted, setIsDeleted] = useState(initIsDeleted);
    // 답변 대기만 보기 체크박스는 status === "waiting" 인 경우 true로 간주
    const [waitingAnswerOnly, setWaitingAnswerOnly] = useState(initStatus === "waiting");

    // 상태 변경 시 URL 반영 (debounce 없이 바로 반영)
    useEffect(() => {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("size", size);

        if (category !== "all") params.set("category", category);
        else params.delete("category");

        if (keyword.trim() !== "") params.set("keyword", keyword);
        else params.delete("keyword");

        if (isDeleted) params.set("isDeleted", "true");
        else params.delete("isDeleted");

        // 답변 대기만 보기 체크박스 상태에 따라 status 쿼리 변경
        if (waitingAnswerOnly) params.set("status", "waiting");
        else if (searchParams.get("status") === "waiting") {
            // 체크해제 시 status 삭제
            params.delete("status");
        } else if (searchParams.get("status")) {
            // 그 외 기존 status가 있다면 유지
            params.set("status", searchParams.get("status")!);
        }

        setSearchParams(params);
    }, [page, size, category, keyword, isDeleted, waitingAnswerOnly, setSearchParams]);

    // 쿼리 파라미터로 API 호출
    const queryParams: FetchAdminInquiriesParams = {
        page,
        size: Number(size),
        keyword: keyword.trim() === "" ? undefined : keyword,
        category: category === "all" ? undefined : category,
        isDeleted: isDeleted ? true : undefined,
        status: waitingAnswerOnly ? "waiting" : undefined,
    };

    const { data, isLoading, isError } = useQuery<PagingResponse<InquiryResponseDTO>>({
        queryKey: ["admin-inquiries", queryParams],
        queryFn: () => fetchAdminInquiries(queryParams).then((res) => res.data),
        staleTime: 1000 * 60 * 10,
    });

    // 페이지 변경 시
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    // size 변경 시 (페이지 초기화)
    const handleSizeChange = (newSize: number) => {
        setSize(String(newSize));
        setPage(0);
    };

    const handleFilterBarSetSize = (value: string) => {
        // 문자열을 숫자로 변환 후 handleSizeChange 호출
        const numSize = Number(value);
        if (!isNaN(numSize)) {
            handleSizeChange(numSize);
        }
    };

    // 답변 대기만 보기 체크박스 변경 핸들러
    const handleWaitingAnswerChange = (checked: boolean) => {
        setWaitingAnswerOnly(checked);
        setPage(0);
    };

    if (isLoading) return <LoadingComponent isLoading />;
    if (isError || !data)
        return <div className="p-4 text-red-500">데이터를 불러오지 못했습니다.</div>;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faQuestionCircle} />
                문의사항 관리
            </h3>

            <InquiryFilterBar
                category={category}
                setCategory={setCategory}
                keyword={keyword}
                setKeyword={setKeyword}
                size={size}               // size는 string 상태이므로 그대로 전달
                setSize={handleFilterBarSetSize}  // string => number 변환 후 처리
                waitingAnswerOnly={waitingAnswerOnly}
                setWaitingAnswerOnly={handleWaitingAnswerChange}
                onSearch={() => setPage(0)}
            />

            <ListComponent
                items={data.content}
                size={Number(size)}
                onSizeChange={handleSizeChange}  // (newSize: number) => void
            />


            <PaginationComponent
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
                maxPageButtons={10}
            />
        </div>
    );
}

export default ListPage;