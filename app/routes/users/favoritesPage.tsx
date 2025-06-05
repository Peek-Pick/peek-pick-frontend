// src/routes/mypage/FavoritesPage.tsx

import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";  // 필요에 따라 포함
import type { PageResponse, ProductListDTO } from "~/types/products";
import { getMyPageFavorite } from "~/api/myPageAPI"; // 실제 경로에 맞게 수정하세요
import { Icon } from "@iconify/react";

/**a
 * 찜한(즐겨찾기) 상품을 페이징 조회하는 React Query 함수 호출 예시입니다.
 * listFavoriteProducts(page: number, size: number) => Promise<PageResponse<ProductListDTO>>
 * 실제 API 엔드포인트(/api/mypage/favorites 등)를 구현해두셔야 합니다.
 */

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
        error,
    } = useInfiniteQuery(
        {
            // 찜한 목록용 쿼리키 (size 변경 시 자동 refetch)
            queryKey: ["favorites", size] as const,
            queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
                // 페이지 파라미터와 사이즈만 전달. 정렬은 백엔드에서 modDate DESC로 고정.
                getMyPageFavorite(pageParam, size),
            getNextPageParam: (
                lastPage: PageResponse<ProductListDTO>,
                allPages: PageResponse<ProductListDTO>[]
            ) => {
                // 마지막 페이지 번호가 아직 전체 페이지 수보다 작으면 다음 페이지 번호 리턴
                return lastPage.number + 1 < lastPage.totalPages
                    ? lastPage.number + 1
                    : undefined;
            },
            initialPageParam: 0,
            staleTime: 5 * 60 * 1000, // 5분
        }
    );

    // 로딩 / 에러 처리
    if (isLoading) {
        return (
            <div className="p-4 text-center">
                <Icon icon="ri:loader-2-line" className="animate-spin w-6 h-6 inline-block mr-2" />
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

    // 각 페이지의 content를 하나의 배열로 평탄화
    const pages = data.pages as PageResponse<ProductListDTO>[];
    const products = pages.flatMap((pg) => pg.content);

    return (
        <>
            {/* 찜한 목록 리스트 */}
            {/* ListComponent: 기존에 만들어둔 ListComponent를 수정 없이 그대로 사용 */}
            <ListComponent
                products={products}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />

            {/* 바닥 네비가 필요하다면 */}
            <BottomNavComponent />
        </>
    );
}
