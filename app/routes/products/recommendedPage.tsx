// src/routes/products/RecommendedPage.tsx

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

    // 로딩 / 에러 처리
    if (isLoading) {
        return (
            <div className="p-4 text-center">
                <Icon
                    icon="ri:loader-2-line"
                    className="animate-spin w-6 h-6 inline-block mr-2"
                />
                불러오는 중…
            </div>
        );
    }
    if (isError) {
        return (
            <div className="p-4 text-center text-red-500">
                에러: {(error as Error).message}
            </div>
        );
    }
    if (!data) {
        return null;
    }

    // 페이지별 content 평탄화
    const pages = data.pages as PageResponse<ProductListDTO>[];
    const products = pages.flatMap((pg) => pg.content);

    return (
        <>
            <ListComponent
                products={products}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
            <BottomNavComponent />
        </>
    );
}
