import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import { useNavigate, useSearchParams, useNavigationType } from "react-router-dom";
import ListComponent from "~/components/products/listComponent";
import { getRanking } from "~/api/products/productsAPI";
import type { PageResponseCursor, ProductListDTO } from "~/types/products";
import { BackParamButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";
import { useTranslation } from "react-i18next";

const STORAGE_KEY = "rankingPageScrollY";

function isPageReload(): boolean {
    const entries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    const last = entries.at(-1);
    if (last && "type" in last) return last.type === "reload";
    return performance.navigation?.type === 1;
}

// 카테고리 ID와 emoji만 포함
const CATEGORY_LIST = [
    { id: 0, emoji: "🔥" }, // 전체
    { id: 1, emoji: "🍪" },
    { id: 2, emoji: "🍙" },
    { id: 3, emoji: "🍜" },
    { id: 4, emoji: "🥐" },
    { id: 5, emoji: "🍦" },
    { id: 6, emoji: "🍬" },
    { id: 7, emoji: "🥤" },
    { id: 8, emoji: "🥪" },
    { id: 9, emoji: "🍱" },
    { id: 10, emoji: "🍎" },
    { id: 11, emoji: "😡" },
    { id: 12, emoji: "🍲" },
    { id: 13, emoji: "🧂" },
    { id: 14, emoji: "💪" },
    { id: 15, emoji: "📦" },
] as const;

type CategoryId = typeof CATEGORY_LIST[number]["id"];

export default function RankingPage() {
    const { t } = useTranslation();
    const size = 12;
    const navigate = useNavigate();
    const navigationType = useNavigationType();
    const [searchParams, setSearchParams] = useSearchParams();

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

    const initialCategoryId = Number(searchParams.get("category") || "0") as CategoryId;
    const [categoryId, setCategoryId] = useState<CategoryId>(initialCategoryId);

    const sortOptions = [
        { label: t("sortProductScore"), icon: "ri:star-fill", param: "score,DESC", color: "text-yellow-400" },
        { label: t("sortProductLike"), icon: "ri:heart-fill", param: "likeCount,DESC", color: "text-red-500" },
    ] as const;

    type SortParamType = typeof sortOptions[number]["param"];
    const [sortParam, setSortParam] = useState<SortParamType>(
        (searchParams.get("sort") as SortParamType) ?? "score,DESC"
    );

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
    const categoryForQuery = categoryId === 0 ? undefined : t(`productCategory.${categoryId}`);

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
            {/* 상단 필터 */}
            <div className={`sticky top-[3.625rem] z-40 transition-transform duration-300 ease-in-out ${showFilters ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="px-4 py-2 bg-transparent">
                    <div className="flex flex-nowrap gap-2 items-center">

                        {/* 카테고리 드롭다운 */}
                        <div className="relative">
                            <select
                                value={categoryId}
                                onChange={(e) => {
                                    const newId = Number(e.target.value) as CategoryId;
                                    setCategoryId(newId);
                                    const newParams: Record<string, string> = {
                                        sort: sortParam,
                                    };
                                    if (newId !== 0) {
                                        newParams.category = String(newId);
                                    }
                                    setSearchParams(newParams);
                                    window.scrollTo(0, 0);
                                }}
                                className="w-12 h-10 pl-2 pr-5 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none"
                            >
                                {CATEGORY_LIST.map(({ id, emoji }) => (
                                    <option key={id} value={id}>
                                        {emoji} {t(`productCategory.${id}`)}
                                    </option>
                                ))}
                            </select>

                            {/* 드롭다운 아이콘 */}
                            <div className="pointer-events-none absolute right-1 top-1/2 transform -translate-y-1/2">
                                <Icon icon="ri:arrow-down-s-line" className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>

                        {/* 정렬 필터 버튼 */}
                        <div className="h-10 shadow-sm rounded-lg border border-gray-300">
                            {sortOptions.map(({ label, param, icon, color }, index) => {
                                const isSelected = sortParam === param;
                                return (
                                    <button
                                        key={param}
                                        onClick={() => {
                                            setSortParam(param);
                                            const newParams: Record<string, string> = {};
                                            if (categoryId !== 0) {
                                                newParams.category = String(categoryId);
                                            }
                                            newParams.sort = param;
                                            setSearchParams(newParams);
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

            {/* 상품 목록 */}
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

            {/* 뒤로가기 버튼 & FAB */}
            <BackParamButton where="/main" />
            <FloatingActionButtons />
        </div>
    );
}
