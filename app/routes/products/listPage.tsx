// src/routes/products/listPage.tsx

import { useInfiniteQuery } from "@tanstack/react-query";
import ProductLayout from "~/layout/productLayout";
import ListComponent from "~/components/products/listComponent";
import { listProducts } from "~/api/productsAPI";
import type { PageResponse, ProductListDTO } from "~/types/products";

export default function ListPage() {
    const size = 10;
    const sort = "likeCount,DESC";

    const {
        data,            // InfiniteData<PageResponse<ProductListDTO>> 로 추론됨
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["productsRanking", size, sort] as const,
        queryFn: ({ pageParam = 0 }) =>
            listProducts(pageParam, size, sort),
        getNextPageParam: (lastPage) =>
            lastPage.number + 1 < lastPage.total_pages
                ? lastPage.number + 1
                : undefined,
        initialPageParam: 0,           // 필수
        staleTime: 5 * 60 * 1000,      // 5분
    });

    if (isLoading) return <div>불러오는 중…</div>;
    if (isError) return <div>에러: {error.message}</div>;

    // ★ data.pages 를 안전하게 사용 가능
    const products = data?.pages.flatMap((pg) => pg.content) ?? [];

    return (
        <ProductLayout>
            <ListComponent
                products={products}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
        </ProductLayout>
    );
}
