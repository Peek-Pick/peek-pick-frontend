// src/routes/products/listPage.tsx

import { useState } from "react";
import { useQuery, keepPreviousData, type UseQueryOptions } from "@tanstack/react-query";
import type { PageResponse, ProductListDTO } from "~/types/products";
import { listProducts } from "~/api/productsAPI";
import ListComponent from "~/components/products/listComponent";
import ProductLayout from "~/layout/productLayout";

type ProductsQueryKey = readonly [
    "productsRanking",
    number, // page
    number, // size
    string  // sort
];

export default function ListPage() {
    const [page, setPage] = useState(0);
    const size = 10;
    const sort = "likeCount,DESC";

    const queryKey: ProductsQueryKey = ["productsRanking", page, size, sort];

    const queryOptions: UseQueryOptions<
        PageResponse<ProductListDTO>, // TQueryFnData
        Error,                       // TError
        PageResponse<ProductListDTO>,// TData
        ProductsQueryKey             // TQueryKey
    > = {
        queryKey,
        queryFn: () => listProducts(page, size, sort),
        placeholderData: keepPreviousData,
        staleTime: 5 * 60 * 1000,    // 5분
    };

    const { data, isLoading, isError, error } = useQuery(queryOptions);

    if (isLoading) {
        return <div className="p-4 text-gray-600">불러오는 중…</div>;
    }
    if (isError || !data) {
        return (
            <div className="p-4 text-red-500">
                에러 발생{error ? `: ${error.message}` : ""}
            </div>
        );
    }

    return (
        <ProductLayout>
            <ListComponent
                products={data.content}
                page={data.number}
                size={data.size}
                totalElements={data.total_elements}
                setPage={setPage}
            />
        </ProductLayout>
    );
}
