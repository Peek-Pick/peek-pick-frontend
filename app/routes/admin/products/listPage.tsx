import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";

import AdminProductsFilterBar from "~/components/admin/products/productFilterBar";
import AdminProductsListComponent from "~/components/admin/products/listComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import { listAdminProducts } from "~/api/products/adminProductsAPI";
import type { PageResponse, ProductListDTO } from "~/types/products";
import { ProductLoading } from "~/util/loading/productLoading";

export default function AdminProductsPage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page") || "0");
    const size = 10;
    const keyword = searchParams.get("keyword") || "";

    const handleSearch = (kw: string) => {
        const params = new URLSearchParams();
        params.set("page", "0");
        params.set("size", size.toString());
        if (kw) params.set("keyword", kw);
        setSearchParams(params);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        setSearchParams(params);
    };

    const queryParams = useMemo(() => ({
        page,
        size,
        keyword: keyword.trim() || undefined,
    }), [page, size, keyword]);

    const { data, isLoading, isError } = useQuery<PageResponse<ProductListDTO>>({
        queryKey: ["adminProducts", queryParams],
        queryFn: () => listAdminProducts(page, size, keyword),
    });

    if (isLoading) {
        return <ProductLoading />;
    }
    if (isError || !data) {
        return <div className="p-4 text-red-500">상품 목록 불러오기 실패</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4">
            {/* 헤더 */}
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faBox} />
                상품 관리
            </h3>

            {/* 검색창 + 상품 추가 버튼 포함된 필터바 */}
            <AdminProductsFilterBar keyword={keyword} onSearch={handleSearch} />

            {/* 상품 목록 */}
            <AdminProductsListComponent data={data.content} />

            {/* 페이지네이션 */}
            <PaginationComponent
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={handlePageChange}
                maxPageButtons={10}
            />
        </div>
    );
}
