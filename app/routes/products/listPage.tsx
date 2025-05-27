// src/routes/products/listPage.tsx

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ProductLayout from "~/layout/productLayout";
import ListComponent from "~/components/products/listComponent";
import { listProducts } from "~/api/productsAPI";
import type { PageResponse, ProductListDTO } from "~/types/products";

export default function ListPage() {
    const size = 10;
    const defaultSortParam = "likeCount,DESC"; // 실제 API 호출에 사용할 기본 정렬

    // 디자인용 상태: 카테고리와 정렬 레이블만 관리
    const [categoryLabel, setCategoryLabel] = useState("전체");
    const [sortLabel, setSortLabel] = useState("❤️ 좋아요 순");
    const [showSortMenu, setShowSortMenu] = useState(false);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["productsRanking", size, defaultSortParam] as const,
        queryFn: ({ pageParam = 0 }) =>
            listProducts(pageParam, size, defaultSortParam),
        getNextPageParam: (lastPage) =>
            lastPage.number + 1 < lastPage.total_pages
                ? lastPage.number + 1
                : undefined,
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) {
        return <div className="p-4 text-center">불러오는 중…</div>;
    }
    if (isError) {
        return (
            <div className="p-4 text-center text-red-500">
                에러: {error?.message}
            </div>
        );
    }

    const products = data?.pages.flatMap((pg) => pg.content) ?? [];

    const sortOptions = [
        "❤️ 좋아요 순",
        "★ 별점 순",
        "📝 리뷰 순",
    ] as const;

    const categories = ["전체", "과자", "음료"] as const;

    return (
        <ProductLayout>
            {/* ——— 디자인: 카테고리 탭 ——— */}
            <div className="flex space-x-2 p-4">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategoryLabel(cat)}
                        className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${categoryLabel === cat
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"}
            `}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* ——— 디자인: 정렬 드롭다운 ——— */}
            <div className="flex justify-end px-4 mb-2">
                <div className="relative inline-block text-left">
                    <button
                        onClick={() => setShowSortMenu((v) => !v)}
                        className="
              px-4 py-2 bg-gray-200 rounded-full text-sm font-medium
              hover:bg-gray-300
            "
                    >
                        {sortLabel}
                    </button>
                    {showSortMenu && (
                        <ul className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                            {sortOptions.map((label) => (
                                <li key={label}>
                                    <button
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setSortLabel(label);
                                            setShowSortMenu(false);
                                        }}
                                    >
                                        {label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* ——— 상품 리스트 (무한 스크롤) ——— */}
            <ListComponent
                products={products}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
        </ProductLayout>
    );
}
