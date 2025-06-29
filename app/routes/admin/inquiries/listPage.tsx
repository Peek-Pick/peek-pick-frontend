import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import type { PagingResponse } from "~/types/common";
import { fetchAdminInquiries } from "~/api/inquiries/inquiriesAPI";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import ListComponent from "~/components/admin/inquiries/listComponent";
import InquiryFilterBar from "~/components/admin/inquiries/inquiryFilterBar";

function ListPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [page, setPage] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [category, setCategory] = useState("all");
    const [includeDeleted, setIncludeDeleted] = useState(false);
    const [waitingAnswerOnly, setWaitingAnswerOnly] = useState(false);

    // URL → 상태 동기화 부분
    useEffect(() => {
        setPage(Math.max(0, Number(searchParams.get("page")) || 0));
        setKeyword(searchParams.get("keyword") || "");
        setCategory(searchParams.get("category") || "all");
        setIncludeDeleted(searchParams.get("includeDeleted") === "true");
        setWaitingAnswerOnly(searchParams.get("isWaiting") === "true");  // isWaiting 쿼리명 맞춤
    }, [searchParams]);

    const applyFiltersToURL = (pageOverride?: number) => {
        const params = new URLSearchParams();
        params.set("page", String(pageOverride ?? page));
        if (category !== "all") params.set("category", category);
        if (keyword.trim() !== "") params.set("keyword", keyword.trim());
        if (includeDeleted) params.set("includeDeleted", "true");
        if (waitingAnswerOnly) params.set("status", "PENDING");
        setSearchParams(params);
    };

    const queryParams = useMemo(() => ({
        page,
        keyword: keyword.trim() || undefined,
        category: category !== "all" ? category : undefined,
        includeDeleted,
        isWaiting: waitingAnswerOnly || undefined,
    }), [page, keyword, category, includeDeleted, waitingAnswerOnly]);

    const { data, isLoading, isError } = useQuery<PagingResponse<InquiryResponseDTO>>({
        queryKey: ["admin-inquiries", queryParams],
        queryFn: () => fetchAdminInquiries(queryParams).then(res => res.data),
    });

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        applyFiltersToURL(newPage);
    };

    const handleWaitingAnswerChange = (checked: boolean) => {
        setWaitingAnswerOnly(checked);
        setPage(0);
        applyFiltersToURL(0);
    };

    const handleIncludeDeletedChange = (checked: boolean) => {
        setIncludeDeleted(checked);
        setPage(0);
        applyFiltersToURL(0);
    };

    if (isLoading) return <LoadingComponent isLoading />;
    if (isError || !data) return <div className="p-4 text-red-500">데이터를 불러오지 못했습니다.</div>;

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
                waitingAnswerOnly={waitingAnswerOnly}
                setWaitingAnswerOnly={handleWaitingAnswerChange}
                includeDeleted={includeDeleted}
                setIncludeDeleted={handleIncludeDeletedChange}
                onSearch={() => setPage(0)}
            />

            <ListComponent
                items={data.content}
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