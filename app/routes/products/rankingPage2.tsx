import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams, useNavigationType } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import { listProducts } from "~/api/products/productsAPI";
import type { PageResponseCursor, ProductListDTO } from "~/types/products";
import {BackButton, BackParamButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";

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

    // const scrollYRef = useRef<number>(0);
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

    type CategoryType = typeof categories[number]["label"] | "카테고리";
    const [categoryLabel, setCategoryLabel] = useState<CategoryType>(
        (searchParams.get("category") as CategoryType) ?? "카테고리"
    );

    // const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    const sortOptions = [
        { label: "Rated", icon: "ri:star-fill", param: "score,DESC", color: "text-yellow-400" },
        { label: "Likes", icon: "ri:heart-fill", param: "likeCount,DESC", color: "text-red-500" },
        // { label: "Match", icon: "ri:sparkling-2-fill", param: "productId,DESC", color: "text-green-500" },
    ] as const;

    // type SortLabelType = typeof sortOptions[number]["label"];
    type SortParamType = typeof sortOptions[number]["param"];

    const [sortParam, setSortParam] = useState<SortParamType>(
        (searchParams.get("sort") as SortParamType) ?? "score,DESC"
    );

    // const sortLabel: SortLabelType = sortOptions.find((s) => s.param === sortParam)?.label ?? "좋아요 순";
    // const [showSortMenu, setShowSortMenu] = useState(false);

    // const displayCategoryLabel =
    //     categoryLabel === "카테고리"
    //         ? "카테고리"
    //         : `${categories.find((c) => c.label === categoryLabel)?.emoji} ${categoryLabel}`;

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
            return await listProducts(
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
                    <div className="flex flex-nowrap gap-2 items-center">

                        {/* 셀렉트 박스 */}
                        <div className="relative ">
                            <select
                                value={categoryLabel}
                                onChange={(e) => {
                                    const label = e.target.value;
                                    setCategoryLabel(label as CategoryType);
                                    const newParams: Record<string, string> = {
                                        sort: sortParam,
                                    };
                                    if (label !== "전체") newParams.category = label;
                                    setSearchParams(newParams);
                                    window.scrollTo(0, 0);
                                }}
                                className="w-12 h-10 pl-2 pr-5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none"
                            >
                                {categories.map(({ label, emoji }) => (
                                    <option key={label} value={label}>
                                        {emoji} {label}
                                    </option>
                                ))}
                            </select>

                            {/* 드롭다운 아이콘 */}
                            <div className="pointer-events-none absolute right-1 top-1/2 transform -translate-y-1/2">
                                <Icon icon="ri:arrow-down-s-line" className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>

                        {/* 필터링 버튼 */}
                        <div className="h-10 shadow-sm rounded-lg border border-gray-300">
                            {sortOptions.map(({ label, param, icon, color }, index) => {
                                const isSelected = sortParam === param;
                                return (
                                    <button
                                        key={param}
                                        onClick={() => {
                                            setSortParam(param);
                                            setSearchParams({
                                                ...(categoryLabel !== "카테고리" ? { category: categoryLabel } : {}),
                                                sort: param,
                                            });
                                            window.scrollTo(0, 0);
                                        }}
                                        className={`
                                                    py-2 px-4 inline-flex justify-center items-center gap-1 text-sm font-medium transition
                                                    ${isSelected ? "h-10 text-gray-900 ring-2 ring-amber-400 ring-inset bg-white" : "bg-white text-gray-900 hover:bg-gray-50"}
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
            <BackParamButton where="/main" />

            <FloatingActionButtons />
        </div>
    );
}
