import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams, useNavigationType } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import { getRanking } from "~/api/products/productsAPI";
import type { PageResponseCursor, ProductListDTO } from "~/types/products";
import { BackButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";

const STORAGE_KEY = "rankingPageScrollY";

function isPageReload(): boolean {
    const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const last = entries.at(-1);
    if (last && "type" in last) return last.type === "reload";
    return performance.navigation?.type === 1;
}

export default function RankingPage() {
    const size = 12;
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const [searchParams, setSearchParams] = useSearchParams();

    const scrollYRef = useRef<number>(0);
    const isRestoredRef = useRef(false);
    const initialLoadRef = useRef(true);

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

    type CategoryType = typeof categories[number]["label"] | "카테고리";
    const [categoryLabel, setCategoryLabel] = useState<CategoryType>(
        (searchParams.get("category") as CategoryType) ?? "카테고리"
    );

    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    const sortOptions = [
        { label: "좋아요 순", icon: "ri:heart-fill", param: "likeCount,DESC", color: "text-red-500" },
        { label: "별점 순", icon: "ri:star-fill", param: "score,DESC", color: "text-yellow-400" },
    ] as const;

    type SortLabelType = typeof sortOptions[number]["label"];
    type SortParamType = typeof sortOptions[number]["param"];

    const [sortParam, setSortParam] = useState<SortParamType>(
        (searchParams.get("sort") as SortParamType) ?? "likeCount,DESC"
    );

    const sortLabel: SortLabelType = sortOptions.find((s) => s.param === sortParam)?.label ?? "좋아요 순";
    const [showSortMenu, setShowSortMenu] = useState(false);

    const displayCategoryLabel =
        categoryLabel === "카테고리"
            ? "카테고리"
            : `${categories.find((c) => c.label === categoryLabel)?.emoji} ${categoryLabel}`;

    const categoryForQuery = categoryLabel === "카테고리" || categoryLabel === "전체" ? undefined : categoryLabel;

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

    const sortKey = sortParam.split(",")[0];

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery<PageResponseCursor<ProductListDTO>, Error>({
        queryKey: ["productsRanking", size, sortParam, categoryForQuery],
        queryFn: async ({ pageParam }) => {
            const last = pageParam as { lastValue?: number; lastProductId?: number } | undefined;
            return await getRanking(
                size,
                last?.lastValue,
                last?.lastProductId,
                categoryForQuery,
                sortParam
            );
        },
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
        if (navigationType === "POP" && data && !isRestoredRef.current) {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) {
                const { scrollY, fromDetail } = JSON.parse(raw);
                if (fromDetail) {
                    window.scrollTo(0, scrollY);
                    requestAnimationFrame(() => window.scrollTo(0, scrollY));
                }
                sessionStorage.removeItem(STORAGE_KEY);
            }
            isRestoredRef.current = true;
        }
    }, [navigationType, data]);

    const handleItemClick = (barcode: string) => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ scrollY: window.scrollY, fromDetail: true }));
        navigate(`/products/${barcode}`, { state: { fromDetail: true } });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className={`sticky top-[3.625rem] z-40 transition-transform duration-300 ease-in-out ${showFilters ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="px-4 py-2 bg-transparent">
                    <div className="flex space-x-2">
                        {/* 카테고리 */}
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
                                                    const params: Record<string, string> = {
                                                        sort: sortParam,
                                                    };
                                                    if (label !== "전체") params.category = label;
                                                    setSearchParams(params);
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

                        {/* 정렬 */}
                        <div className="relative inline-block text-left flex-1">
                            <button
                                onClick={() => {
                                    setShowSortMenu((v) => !v);
                                    setShowCategoryMenu(false);
                                }}
                                className="w-full flex items-center justify-between px-3 py-1.5 bg-white border rounded-full hover:bg-gray-100 text-xs"
                            >
                                <span className="flex items-center">
                                    <Icon icon={sortOptions.find((s) => s.label === sortLabel)!.icon}
                                          className={`w-5 h-5 mr-1 ${sortOptions.find((s) => s.label === sortLabel)!.color}`} />
                                    <span>{sortLabel}</span>
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
                                                    const params: Record<string, string> = {};
                                                    if (categoryLabel !== "카테고리" && categoryLabel !== "전체") {
                                                        params.category = categoryLabel;
                                                    }
                                                    params.sort = param;
                                                    setSearchParams(params);
                                                    window.scrollTo(0, 0);
                                                }}
                                                className={`flex items-center w-full text-left px-4 py-2 text-xs hover:bg-gray-100 ${sortLabel === label ? "font-bold" : ""}`}
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

            <ListComponent
                products={
                    data
                        ? data.pages
                            .flatMap((pg, pgIdx) =>
                                pg.content.map((item, i) => ({
                                    ...item,
                                    rank: pgIdx * size + i + 1,
                                }))
                            )
                        : []
                }
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                isError={isError}
                onItemClick={handleItemClick}
                isRanking={true}
            />

            {/*<BottomNavComponent />*/}
            <BackButton />
            <FloatingActionButtons />
        </div>
    );
}
