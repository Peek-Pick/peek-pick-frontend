import { useState, useEffect, useMemo } from "react";
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

    const [page, setPage] = useState(Number(searchParams.get("page") || 0));
    const [size, setSize] = useState(searchParams.get("size") || "10");
    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "all");
    const [includeDeleted, setIncludeDeleted] = useState(searchParams.get("includeDeleted") === "true");
    const [waitingAnswerOnly, setWaitingAnswerOnly] = useState(searchParams.get("status") === "PENDING");

    useEffect(() => {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("size", size);

        if (category !== "all") params.set("category", category);
        if (keyword.trim() !== "") params.set("keyword", keyword.trim());
        if (includeDeleted) params.set("includeDeleted", "true");
        if (waitingAnswerOnly) params.set("status", "PENDING");

        setSearchParams(params);
    }, [page, size, category, keyword, includeDeleted, waitingAnswerOnly]);

    const queryParams = useMemo(() => ({
        page,
        size: Number(size),
        keyword: keyword.trim() || undefined,
        category: category !== "all" ? category : undefined,
        includeDeleted,
        status: waitingAnswerOnly ? "PENDING" : undefined,
    }), [page, size, keyword, category, includeDeleted, waitingAnswerOnly]);

    const { data, isLoading, isError } = useQuery<PagingResponse<InquiryResponseDTO>>({
        queryKey: ["admin-inquiries", queryParams],
        queryFn: () => fetchAdminInquiries(queryParams).then(res => res.data),
        staleTime: 1000 * 60 * 10,
    });

    const handlePageChange = (newPage: number) => setPage(newPage);
    const handleSizeChange = (newSize: number) => {
        setSize(String(newSize));
        setPage(0);
    };

    const handleWaitingAnswerChange = (checked: boolean) => {
        setWaitingAnswerOnly(checked);
        setPage(0);
    };

    const handleIncludeDeletedChange = (checked: boolean) => {
        setIncludeDeleted(checked);
        setPage(0);
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
                size={size}
                setSize={(val: string) => {
                    const numSize = Number(val);
                    if (!isNaN(numSize)) handleSizeChange(numSize);
                }}
                waitingAnswerOnly={waitingAnswerOnly}
                setWaitingAnswerOnly={handleWaitingAnswerChange}
                includeDeleted={includeDeleted}
                setIncludeDeleted={handleIncludeDeletedChange}
                onSearch={() => setPage(0)}
            />

            <ListComponent
                items={data.content}
                size={Number(size)}
                onSizeChange={handleSizeChange}
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