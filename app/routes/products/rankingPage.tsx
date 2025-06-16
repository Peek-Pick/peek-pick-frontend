// src/routes/products/rankingPage.tsx
import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import ListComponent from "~/components/products/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { listProducts } from "~/api/products/productsAPI";
import type { PageResponse, ProductListDTO } from "~/types/products";

export default function RankingPage() {
    const size = 10;

    // 1) 카테고리 드롭다운 상태
    const categories = [
        { label: "전체", emoji: "🔥" },
        { label: "과자류", emoji: "🍪" },
        { label: "김밥", emoji: "🍙" },
        { label: "면류", emoji: "🍜" },
        { label: "빵, 디저트", emoji: "🥐" },
        { label: "아이스크림", emoji: "🍦" },
        { label: "캔디류", emoji: "🍬" },
        { label: "음료", emoji: "🥤" },
        { label: "샌드위치-햄버거", emoji: "🥪" },
        { label: "도시락", emoji: "🍱" },
        { label: "안주", emoji: "🍻" },
    ] as const;
    type CategoryType = typeof categories[number]["label"];
    const [categoryLabel, setCategoryLabel] = useState<CategoryType>("전체");
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

    // 2) 정렬 드롭다운 상태
    const sortOptions = [
        { label: "좋아요 순", icon: "ri:heart-fill", param: "likeCount,DESC", color: "text-red-500" },
        { label: "별점 순", icon: "ri:star-fill", param: "score,DESC", color: "text-yellow-400" },
    ] as const;
    type SortLabelType = typeof sortOptions[number]["label"];
    type SortParamType = typeof sortOptions[number]["param"];
    const [sortLabel, setSortLabel] = useState<SortLabelType>("별점 순");
    const [sortParam, setSortParam] = useState<SortParamType>("score,DESC");
    const [showSortMenu, setShowSortMenu] = useState(false);
    const sortRef = useRef<HTMLDivElement>(null);

    // 3) 스크롤 시 필터 영역 숨김/보임 제어
    const [showFilters, setShowFilters] = useState(true);
    const lastScrollY = useRef(0);
    useEffect(() => {
        const handler = () => {
            const currentY = window.scrollY;
            if (currentY > lastScrollY.current && currentY > 100) {
                setShowFilters(false);
            } else {
                setShowFilters(true);
            }
            lastScrollY.current = currentY;
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    // 4) 화면 터치/클릭 시 드롭다운 닫기 로직
    useEffect(() => {
        const handleClickOutside = (ev: MouseEvent | TouchEvent) => {
            const target = ev.target as Node;
            if (
                showCategoryMenu &&
                categoryRef.current &&
                !categoryRef.current.contains(target)
            ) {
                setShowCategoryMenu(false);
            }
            if (
                showSortMenu &&
                sortRef.current &&
                !sortRef.current.contains(target)
            ) {
                setShowSortMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [showCategoryMenu, showSortMenu]);

    // 5) 필터(카테고리/정렬) 변경 시 스크롤을 최상단으로 올리는 로직
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [categoryLabel, sortParam]);

    // 6) 카테고리 파라미터: "전체"는 빈 문자열로 변환
    const categoryParam = categoryLabel === "전체" ? "" : categoryLabel;

    // 7) React Query: 랭킹 목록 무한 스크롤
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["productsRanking", size, sortParam, categoryParam] as const,
        queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
            listProducts(
                pageParam,
                size,
                sortParam,
                categoryParam || undefined
            ),
        getNextPageParam: (lastPage: PageResponse<ProductListDTO>) =>
            lastPage.number + 1 < lastPage.totalPages
                ? lastPage.number + 1
                : undefined,
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 필터 영역 (카테고리 + 정렬) */}
            <div
                className={`
          -mt-4 sticky top-16 bg-white z-40 border-b 
          transform transition-transform duration-300 ease-in-out
          ${showFilters ? "translate-y-0" : "-translate-y-full"}
        `}
            >
                <div className="flex items-center px-4 py-2 space-x-4">
                    {/* 카테고리 드롭다운 */}
                    <div ref={categoryRef} className="relative inline-block text-left">
                        <button
                            onClick={() => {
                                setShowCategoryMenu((v) => !v);
                                setShowSortMenu(false);
                            }}
                            className="flex items-center px-4 py-2 rounded-full border hover:bg-gray-100 text-sm"
                        >
                            <span className="mr-2">
                                {categories.find((c) => c.label === categoryLabel)?.emoji} {categoryLabel}
                            </span>
                            <Icon icon="ri:arrow-down-s-line" className="w-4 h-4" />
                        </button>
                        {showCategoryMenu && (
                            <ul className="absolute left-0 mt-2 w-44 bg-white border rounded shadow-lg z-10 max-h-60 overflow-auto">
                                {categories.map(({ label, emoji }) => (
                                    <li key={label}>
                                        <button
                                            onClick={() => {
                                                setCategoryLabel(label);
                                                setShowCategoryMenu(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                categoryLabel === label ? "font-bold" : ""
                                            }`}
                                        >
                                            {emoji} {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* 정렬 드롭다운 */}
                    <div ref={sortRef} className="relative inline-block text-left">
                        <button
                            onClick={() => {
                                setShowSortMenu((v) => !v);
                                setShowCategoryMenu(false);
                            }}
                            className="flex items-center px-4 py-2 rounded-full border hover:bg-gray-100 text-sm"
                        >
                            <span className="mr-2">
                                <Icon
                                    icon={sortOptions.find((s) => s.label === sortLabel)!.icon}
                                    className={`w-5 h-5 ${sortOptions.find((s) => s.label === sortLabel)!.color}`}
                                />
                            </span>
                            <span>{sortLabel}</span>
                        </button>
                        {showSortMenu && (
                            <ul className="absolute left-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                                {sortOptions.map(({ label, icon, param, color }) => (
                                    <li key={label}>
                                        <button
                                            onClick={() => {
                                                setSortLabel(label);
                                                setSortParam(param);
                                                setShowSortMenu(false);
                                            }}
                                            className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                sortLabel === label ? "font-bold" : ""
                                            }`}
                                        >
                                            <Icon icon={icon} className={`w-4 h-4 mr-2 ${color}`} />
                                            <span>{label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <ListComponent
                products={data ? data.pages.flatMap((pg) => pg.content) : []}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                isError={isError}
            />

            <BottomNavComponent />
        </div>
    );
}
