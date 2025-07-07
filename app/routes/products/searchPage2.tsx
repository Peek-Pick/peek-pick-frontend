import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams, useNavigationType } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import { searchProducts, searchProductsByScore } from "~/api/products/productsAPI";
import type { PageResponseCursor, ProductListDTO } from "~/types/products";
import { BackParamButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";
import { ProductLoading } from "~/util/loading/productLoading";
import { getLocalizedCategories, CATEGORY_LIST } from "~/types/categories";
import type { Locale } from "~/types/categories";
import { useTranslation } from "react-i18next";

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
    const navigationType = useNavigationType();
    const [searchParams, setSearchParams] = useSearchParams();
    const { t, i18n } = useTranslation();
    const lang = i18n.language;
    const isRestoredRef = useRef(false);
    const initialLoadRef = useRef(true);
    const lastScrollY = useRef(0);
    const [showFilters, setShowFilters] = useState(true);

    // 쿼리스트링 초기값
    const keyword = searchParams.get("keyword") ?? "";
    const initialCategoryId = parseInt(searchParams.get("category") ?? "0", 10);
    const initialSortParam = searchParams.get("sort") ?? "_score,DESC";

    const [inputValue, setInputValue] = useState(keyword);
    const [categoryId, setCategoryId] = useState(initialCategoryId);
    const [sortParam, setSortParam] = useState(initialSortParam);
    const sortKey = sortParam.split(",")[0];

    const locale = i18n.language as Locale;
    const localizedCategories = getLocalizedCategories(locale);
    const categories = [{ id: 0, emoji: "🔥", label: t("productCategory.0") }, ...localizedCategories];

    const categoryForQuery = categoryId === 0 ? undefined : t(`productCategory.${categoryId}`);

    const sortOptions = [
        { label: t("sortProductMatch"), icon: "ri:sparkling-2-fill", param: "_score,DESC", color: "text-green-500" },
        { label: t("sortProductLike"), icon: "ri:heart-fill", param: "likeCount,DESC", color: "text-red-500" },
        { label: t("sortProductScore"), icon: "ri:star-fill", param: "score,DESC", color: "text-yellow-400" },
    ] as const;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["productsSearch", size, sortParam, categoryForQuery, keyword, lang],
        queryFn: async ({ pageParam = 0 }) => {
            if (sortKey === "_score") {
                const page = pageParam as number;
                return await searchProductsByScore(size, page, categoryForQuery, keyword, lang);
            } else {
                const cursor = pageParam as { lastValue?: number; lastProductId?: number } | undefined;
                return (await searchProducts(size, cursor?.lastValue, cursor?.lastProductId, categoryForQuery, keyword, sortParam, lang)).content;
            }
        },
        getNextPageParam: (lastPage, allPages) => {
            if (sortKey === "_score") {
                const last = lastPage as ProductListDTO[];
                const nextPage = allPages.length;
                return last.length === size ? nextPage : undefined;
            } else {
                const last = (lastPage as ProductListDTO[]).at(-1);
                if (!last) return undefined;
                const lastValue = sortKey === "score" ? (last.score ?? 0) : (last.likeCount ?? 0);
                return { lastValue, lastProductId: last.productId };
            }
        },
        initialPageParam: 0,
        enabled: keyword.trim() !== "",
        staleTime: 1000 * 60 * 5,
    });

    useLayoutEffect(() => {
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
        if (initialLoadRef.current) {
            if (isPageReload()) {
                window.scrollTo(0, 0);
                sessionStorage.removeItem(STORAGE_KEY);
                isRestoredRef.current = false;
            }
            initialLoadRef.current = false;
        }
        return () => {
            if ("scrollRestoration" in window.history) {
                window.history.scrollRestoration = "auto";
            }
        };
    }, []);

    useEffect(() => {
        if (navigationType !== "POP") {
            sessionStorage.removeItem(STORAGE_KEY);
            isRestoredRef.current = false;
        }
    }, [navigationType]);

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

    useEffect(() => {
        const onScroll = () => {
            const y = window.scrollY;
            setShowFilters(y <= lastScrollY.current || y < 100);
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const handleSearch = () => {
        const trimmed = inputValue.trim();
        if (trimmed) {
            const newParams: Record<string, string> = {
                keyword: trimmed,
                sort: sortParam,
            };
            if (categoryId !== 0) {
                newParams.category = categoryId.toString();
            }
            setSearchParams(newParams);
            window.scrollTo(0, 0);
        }
    };

    const handleItemClick = (barcode: string) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ scrollY: window.scrollY }));
        navigate(`/products/${barcode}`, { state: { fromSearch: true } });
    };

    if (isLoading) return <ProductLoading />;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 필터 영역 */}
            <div className={`sticky top-[3.625rem] z-40 transition-transform duration-300 ease-in-out ${showFilters ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="px-4 py-2 bg-transparent">
                    <div className="relative w-full">
                        {/* 카테고리 드롭다운 */}
                        <select
                            value={categoryId}
                            onChange={(e) => {
                                const newId = parseInt(e.target.value, 10);
                                setCategoryId(newId);
                                const newParams: Record<string, string> = {
                                    keyword: inputValue.trim(),
                                    sort: sortParam,
                                };
                                if (newId !== 0) newParams.category = newId.toString();
                                setSearchParams(newParams);
                                window.scrollTo(0, 0);
                            }}
                            className="absolute left-0 top-0 z-10 w-16 h-10 pl-3 pr-8 text-sm text-gray-900 rounded-lg appearance-none focus:outline-none"
                        >
                            {categories.map(({ id, emoji }) => (
                                <option key={id} value={id}>
                                    {emoji} {t(`productCategory.${id}`)}
                                </option>
                            ))}
                        </select>

                        {/* 드롭다운 아이콘 */}
                        <div className="pointer-events-none absolute left-10 top-1/2 z-20 transform -translate-y-1/2">
                            <Icon icon="ri:arrow-down-s-line" className="w-4 h-4 text-gray-500" />
                        </div>

                        {/* 검색 입력 */}
                        <input
                            type="text"
                            placeholder={t("productSearch")}
                            className="w-full h-10 pl-17 pr-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                        />

                        {/* X 버튼 */}
                        {inputValue && (
                            <button
                                onClick={() => setInputValue("")}
                                className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1"
                            >
                                <Icon icon="ri:close-line" className="w-4 h-4 text-gray-600" />
                            </button>
                        )}

                        {/* 검색 버튼 */}
                        <button
                            onClick={handleSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                        >
                            <Icon icon="ri:search-line" className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* 정렬 필터 버튼 */}
                    <div className="flex justify-center w-full mt-2">
                        <div className="inline-flex shadow-sm rounded-lg overflow-hidden border border-gray-300">
                            {sortOptions.map(({ label, param, icon, color }, index) => {
                                const isSelected = sortParam === param;
                                return (
                                    <button
                                        key={param}
                                        onClick={() => {
                                            setSortParam(param);
                                            const newParams: Record<string, string> = {
                                                keyword: inputValue.trim(),
                                                sort: param,
                                            };
                                            if (categoryId !== 0) newParams.category = categoryId.toString();
                                            setSearchParams(newParams);
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

            {/* 상품 목록 */}
            {keyword.trim() !== "" && (
                <ListComponent
                    products={data?.pages.flat() ?? []}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    isLoading={isLoading}
                    isError={isError}
                    onItemClick={handleItemClick}
                />
            )}

            {/* 하단 UI */}
            <BackParamButton where="/main" />
            <FloatingActionButtons />
        </div>
    );
}
