// src/routes/mypage/favoritesPage.tsx

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import type { PageResponse, ProductListDTO } from "~/types/products";
import { getMyPageFavorite } from "~/api/users/myPageAPI"; // 실제 경로에 맞게 수정하세요

export default function FavoritesPage() {
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
    } = useInfiniteQuery({
        queryKey: ["favorites", size] as const,
        queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
            getMyPageFavorite(pageParam, size),
        getNextPageParam: (
            lastPage: PageResponse<ProductListDTO>
        ) => {
            return lastPage.number + 1 < lastPage.totalPages
                ? lastPage.number + 1
                : undefined;
        },
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
    });

    const products = data
        ? (data.pages as PageResponse<ProductListDTO>[]).flatMap((pg) => pg.content)
        : [];

    return (
        <>
            {/* 찜한 목록 리스트 */}
            <ListComponent
                products={products}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                isError={isError}
            />

            {/* 바닥 네비게이션 */}
            <BottomNavComponent />
        </>
    );
}
