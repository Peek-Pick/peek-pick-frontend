import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { searchProducts } from "~/api/products/productsAPI";
import type { PageResponseCursor, ProductListDTO } from "~/types/products";
import {BackParamButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";

const STORAGE_KEY = "searchPageScrollY";

function isPageReload(): boolean {
    const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const last = entries.at(-1);
    if (last && "type" in last) return last.type === "reload";
    return performance.navigation?.type === 1;
}

export default function SearchPage2() {
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
        { label: "삼각김밥/김밥", emoji: "🍙" },
        { label: "면류", emoji: "🍜" },
        { label: "빵/디저트", emoji: "🥐" },
        { label: "아이스크림", emoji: "🍦" },
        { label: "캔디/껌", emoji: "🍬" },
        { label: "음료", emoji: "🥤" },
        { label: "샌드위치/햄버거", emoji: "🥪" },
        { label: "도시락", emoji: "🍱" },
        { label: "과일/샐러드", emoji: "🍎" },
        { label: "즉석섭취식품", emoji: "😡" },
        { label: "즉석조리식품", emoji: "🍲" },
        { label: "식재료", emoji: "🧂" },
        { label: "건강식품", emoji: "💪" },
    ] as const;

    const sortOptions = [
        { label: "Match", icon: "ri:sparkling-2-fill", param: "productId,DESC", color: "text-green-500" },
        { label: "Likes", icon: "ri:heart-fill", param: "likeCount,DESC", color: "text-red-500" },
        { label: "Rated", icon: "ri:star-fill", param: "score,DESC", color: "text-yellow-400" },
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
        <div className="min-h-screen bg-gray-50 ">
            <div className={`sticky top-[3.625rem] z-40 transition-transform duration-300 ease-in-out ${showFilters ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="px-4 py-2 bg-transparent">
                    <div className="relative w-full">
                        {/* 셀렉트 드롭다운 */}
                        <select
                            value={categoryLabel}
                            onChange={(e) => {
                                const label = e.target.value;
                                setCategoryLabel(label);
                                const newParams: Record<string, string> = {
                                    keyword: inputValue.trim(),
                                    sort: sortParam,
                                };
                                if (label !== "전체") newParams.category = label;
                                setSearchParams(newParams);
                                window.scrollTo(0, 0);
                            }}
                            className="absolute left-0 top-0 z-10 w-16 h-10 pl-3 pr-8 text-sm text-gray-900 rounded-lg appearance-none focus:outline-none"
                        >
                            {categories.map(({label, emoji}) => (
                                <option key={label} value={label}>
                                    {emoji} {label}
                                </option>
                            ))}
                        </select>

                        {/* 드롭다운 아이콘 */}
                        <div className="pointer-events-none absolute left-10 top-1/2 z-20 transform -translate-y-1/2">
                            <Icon icon="ri:arrow-down-s-line" className="w-4 h-4 text-gray-500"/>
                        </div>

                        {/* 검색창 */}
                        <input
                            type="text"
                            placeholder="상품명 검색"
                            className="w-full h-10 pl-17 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                        />

                        {/* x 버튼 */}
                        {inputValue && (
                            <button
                                onClick={() => setInputValue("")}
                                className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1"
                            >
                                <Icon icon="ri:close-line" className="w-4 h-4 text-gray-600"/>
                            </button>
                        )}

                        {/* 검색 버튼 */}
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                        >
                            <Icon icon="ri:search-line" className="w-5 h-5 text-gray-600"/>
                        </button>
                    </div>

                    {/*필터링 버튼*/}
                    <div className="flex justify-center w-full mt-2">
                        <div className="inline-flex shadow-sm rounded-lg overflow-hidden border border-gray-300">
                            {sortOptions.map(({ label, param, icon, color }, index) => {
                                const isSelected = sortParam === param;
                                return (
                                    <button
                                        key={param}
                                        onClick={() => {
                                            setSortParam(param);
                                            setSearchParams({
                                                keyword: inputValue.trim(),
                                                ...(categoryLabel !== "카테고리" ? { category: categoryLabel } : {}),
                                                sort: param,
                                            });
                                            window.scrollTo(0, 0);
                                        }}
                                        className={`
                        py-2 px-4 inline-flex justify-center items-center gap-1 text-sm font-medium transition
                        ${isSelected ? "text-gray-900 ring-2 ring-amber-400 ring-inset bg-white" : "bg-white text-gray-900 hover:bg-gray-50"}
                        ${index === 0 ? "rounded-l-lg" : ""}
                        ${index === sortOptions.length - 1 ? "rounded-r-lg border-r-0" : "border-r border-gray-300"}
                    `}
                                    >
                                        <Icon icon={icon} className={`w-4 h-4 ${color}`} />
                                        {label}
                                    </button>
                                );
                            })}
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

            {/*<BottomNavComponent />*/}
            <BackParamButton where="/main" />
            <FloatingActionButtons/>
        </div>
    );
}
