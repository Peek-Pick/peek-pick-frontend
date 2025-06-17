import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { searchProducts } from "~/api/products/productsAPI";
import type { PageResponseCursor, ProductListDTO } from "~/types/products";

const STORAGE_KEY = "searchPageScrollY";

function isPageReload(): boolean {
    const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const last = entries.at(-1);
    if (last && "type" in last) return last.type === "reload";
    return performance.navigation?.type === 1;
}

export default function SearchPage() {
    const size = 12;
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const scrollYRef = useRef<number>(0);
    const isRestoredRef = useRef(false);
    const initialLoadRef = useRef(true);

    const [showFilters, setShowFilters] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setShowFilters(y <= lastScrollY.current || y < 100);
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useLayoutEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        if (initialLoadRef.current) {
            if (isPageReload()) {
                window.scrollTo(0, 0);
                sessionStorage.removeItem(STORAGE_KEY);
                isRestoredRef.current = false;
                console.log("[SearchPage] 새로고침 감지 → scrollTo(0,0)");
            }
            initialLoadRef.current = false;
        }
        return () => {
            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "auto";
            }
        };
    }, []);

    const keyword = searchParams.get("keyword") ?? "";
    const initialCategoryParam = searchParams.get("category") ?? "카테고리";
    const initialSortParam = searchParams.get("sort") ?? "likeCount,DESC";

    const [inputValue, setInputValue] = useState(keyword);
    const [categoryLabel, setCategoryLabel] = useState(initialCategoryParam);
    const [sortParam, setSortParam] = useState(initialSortParam);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);

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

    const sortOptions = [
        { label: "좋아요 순", icon: "ri:heart-fill", param: "likeCount,DESC", color: "text-red-500" },
        { label: "별점 순", icon: "ri:star-fill", param: "score,DESC", color: "text-yellow-400" },
    ] as const;

    const displayCategoryLabel =
        categoryLabel === "카테고리"
            ? "카테고리"
            : `${categories.find((c) => c.label === categoryLabel)?.emoji} ${categoryLabel}`;

    const displaySortLabel = sortOptions.find((s) => s.param === sortParam)?.label ?? "정렬";

    const categoryForQuery = categoryLabel === "카테고리" || categoryLabel === "전체" ? undefined : categoryLabel;
    const sortKey = sortParam.split(",")[0];

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery<PageResponseCursor<ProductListDTO>, Error>({
        queryKey: ["productsSearch", size, sortParam, categoryForQuery, keyword],
        queryFn: async ({ pageParam }) => {
            const last = pageParam as { lastValue?: number; lastProductId?: number } | undefined;
            return await searchProducts(
                size,
                last?.lastValue,
                last?.lastProductId,
                categoryForQuery,
                keyword,
                sortParam
            );
        },
        enabled: keyword.trim() !== "",
        getNextPageParam: (lastPage) => {
            const last = lastPage.content.at(-1);
            if (!last || !lastPage.hasNext) return undefined;

            // ✅ null 그대로 넘김 (null이면 null 그대로 전달)
            const lastValue = sortKey === "score"
                ? last.score
                : last.likeCount ?? 0;

            return {
                lastValue,
                lastProductId: last.productId,
            };
        },
        initialPageParam: undefined,
        staleTime: 5 * 60 * 1000,
    });

    useEffect(() => {
        if (!isRestoredRef.current && data) {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                const y = parsed.scrollY;
                if (y > 0) {
                    window.scrollTo(0, y);
                    requestAnimationFrame(() => window.scrollTo(0, y));
                }
                sessionStorage.removeItem(STORAGE_KEY);
            }
            isRestoredRef.current = true;
        }
    }, [data]);

    const handleSearch = () => {
        const trimmed = inputValue.trim();
        if (trimmed) {
            const newParams: Record<string, string> = {
                keyword: trimmed,
                sort: sortParam,
            };
            if (categoryLabel !== "카테고리") {
                newParams.category = categoryLabel;
            }
            setSearchParams(newParams);
            window.scrollTo(0, 0);
        }
    };

    const handleItemClick = (barcode: string) => {
        scrollYRef.current = window.scrollY;
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ scrollY: scrollYRef.current }));
        navigate(`/products/${barcode}`, { state: { fromSearch: true } });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className={`sticky top-[3.625rem] z-40 transition-transform duration-300 ease-in-out ${showFilters ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="px-4 py-2 bg-transparent">
                    <div className="relative mb-2">
                        <input
                            type="text"
                            placeholder="상품명 검색"
                            className="w-full border rounded-full px-3 py-1.5 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                        />
                        {inputValue && (
                            <button
                                onClick={() => setInputValue("")}
                                className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1"
                            >
                                <Icon icon="ri:close-line" className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
                        >
                            <Icon icon="ri:search-line" className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    <div className="flex space-x-2">
                        {/* 카테고리 드롭다운 */}
                        <div className="relative inline-block text-left flex-1">
                            <button
                                onClick={() => {
                                    setShowCategoryMenu((v) => !v);
                                    setShowSortMenu(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-1.5 bg-white border rounded-full hover:bg-gray-100 text-xs"
                            >
                                <span>{displayCategoryLabel}</span>
                                <Icon icon="ri:arrow-down-s-line" className="w-5 h-5" />
                            </button>
                            {showCategoryMenu && (
                                <ul className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-auto">
                                    {categories.map(({ label, emoji }) => (
                                        <li key={label}>
                                            <button
                                                onClick={() => {
                                                    setCategoryLabel(label);
                                                    setShowCategoryMenu(false);
                                                    const newParams: Record<string, string> = {
                                                        keyword: inputValue.trim(),
                                                        sort: sortParam,
                                                    };
                                                    if (label !== "전체") {
                                                        newParams.category = label;
                                                    }
                                                    setSearchParams(newParams);
                                                    window.scrollTo(0, 0);
                                                }}
                                                className={`flex items-center w-full text-left px-4 py-2 text-xs hover:bg-gray-100 ${categoryLabel === label ? "font-bold" : ""}`}
                                            >
                                                <span className="mr-2">{emoji}</span>
                                                <span>{label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* 정렬 드롭다운 */}
                        <div className="relative inline-block text-left flex-1">
                            <button
                                onClick={() => {
                                    setShowSortMenu((v) => !v);
                                    setShowCategoryMenu(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-1.5 bg-white border rounded-full hover:bg-gray-100 text-xs"
                            >
                                <span className="flex items-center">
                                    <Icon icon={sortOptions.find((s) => s.param === sortParam)?.icon ?? "ri:heart-fill"}
                                          className={`w-5 h-5 mr-1 ${sortOptions.find((s) => s.param === sortParam)?.color ?? "text-red-500"}`} />
                                    <span>{displaySortLabel}</span>
                                </span>
                                <Icon icon="ri:arrow-down-s-line" className="w-5 h-5" />
                            </button>
                            {showSortMenu && (
                                <ul className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-10">
                                    {sortOptions.map(({ label, icon, param, color }) => (
                                        <li key={label}>
                                            <button
                                                onClick={() => {
                                                    setSortParam(param);
                                                    setShowSortMenu(false);
                                                    const newParams: Record<string, string> = {
                                                        keyword: inputValue.trim(),
                                                    };
                                                    if (categoryLabel !== "카테고리") {
                                                        newParams.category = categoryLabel;
                                                    }
                                                    newParams.sort = param;
                                                    setSearchParams(newParams);
                                                    window.scrollTo(0, 0);
                                                }}
                                                className={`flex items-center w-full text-left px-4 py-2 text-xs hover:bg-gray-100 ${sortParam === param ? "font-bold" : ""}`}
                                            >
                                                <Icon icon={icon} className={`w-5 h-5 mr-2 ${color}`} />
                                                <span>{label}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {keyword.trim() !== "" && (
                <ListComponent
                    products={data ? data.pages.flatMap((pg) => pg.content) : []}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                    isError={isError}
                    onItemClick={handleItemClick}
                />
            )}

            <BottomNavComponent />
        </div>
    );
}
