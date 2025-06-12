// src/routes/products/recommendedPage.tsx
import { useInfiniteQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import type { PageResponse, ProductListDTO } from "~/types/products";
import { getRecommendedProducts } from "~/api/products/productsAPI";
import { Icon } from "@iconify/react";

export default function RecommendedPage() {
    const size = 10;
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["recommended", size] as const,
        queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
            getRecommendedProducts(pageParam, size),
        getNextPageParam: (
            lastPage: PageResponse<ProductListDTO>,
            _allPages: PageResponse<ProductListDTO>[]
        ) =>
            lastPage.number + 1 < lastPage.totalPages
                ? lastPage.number + 1
                : undefined,
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
    });

    return (
        <>
            <ListComponent
                products={data ? data.pages.flatMap((pg) => pg.content) : []}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                isError={isError}
            />
            <BottomNavComponent />
        </>
    );
}
