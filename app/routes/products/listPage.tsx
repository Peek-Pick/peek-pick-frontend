// src/routes/products/ListPage.tsx
import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import ListComponent from "~/components/products/listComponent";
import { listProducts } from "~/api/productsAPI";
import type { PageResponse, ProductListDTO } from "~/types/products";

export default function ProductListPage() {
    const size = 10;
    const queryClient = useQueryClient();

    // 검색창 상태
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    // 카테고리 목록(이모지 포함)
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

    // 정렬 목록(아이콘 + 색상)
    const sortOptions = [
        { label: "좋아요 순", icon: "ri:heart-fill", param: "likeCount,DESC", color: "text-red-500" },
        { label: "별점 순", icon: "ri:star-fill", param: "score,DESC", color: "text-yellow-400" },
    ] as const;
    type SortLabelType = typeof sortOptions[number]["label"];
    type SortParamType = typeof sortOptions[number]["param"];
    const [sortLabel, setSortLabel] = useState<SortLabelType>("좋아요 순");
    const [sortParam, setSortParam] = useState<SortParamType>("likeCount,DESC");
    const [showSortMenu, setShowSortMenu] = useState(false);

    // 스크롤 감지 (필터 영역 보였다 숨기기)
    const [showFilters, setShowFilters] = useState(true);
    const lastScrollY = useRef(0);
    useEffect(() => {
        const handler = () => {
            const y = window.scrollY;
            setShowFilters(!(y > lastScrollY.current && y > 100));
            lastScrollY.current = y;
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => window.removeEventListener("scroll", handler);
    }, []);

    const categoryParam = categoryLabel === "전체" ? "" : categoryLabel;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["productsRanking", size, sortParam, categoryParam, searchKeyword] as const,
        queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
            listProducts(
                pageParam,
                size,
                sortParam,
                categoryParam || undefined,
                searchKeyword || undefined
            ),
        getNextPageParam: (
            lastPage: PageResponse<ProductListDTO>,
            _allPages: PageResponse<ProductListDTO>[]
        ) =>
            lastPage.number + 1 < lastPage.total_pages
                ? lastPage.number + 1
                : undefined,
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
    });

    if (isLoading) return <div className="p-4 text-center">불러오는 중…</div>;
    if (isError) return <div className="p-4 text-center text-red-500">에러: {error?.message}</div>;
    if (!data) return null;

    const pages = data.pages as PageResponse<ProductListDTO>[];
    const products = pages.flatMap((pg) => pg.content);

    const handleSearch = () => {
        setSearchKeyword(inputValue.trim());
        setShowSearchInput(false);
    };

    return (
        <>
            {/* 제목은 일반 텍스트로만 표시 */}
            <div className="px-4 py-4">
                <h1 className="text-2xl font-bold">상품 랭킹</h1>
            </div>

            {/* 필터 영역 (카테고리, 정렬, 검색 버튼) */}
            <div
                className={`
          sticky top-12 bg-white z-40 border-b 
          transform transition-transform duration-200 
          ${showFilters ? "translate-y-0" : "-translate-y-full"}
        `}
            >
                <div className="flex items-center px-4 py-2 space-x-4">
                    {/* 카테고리 드롭다운 */}
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setShowCategoryMenu((v) => !v)}
                            className="flex items-center px-4 py-2 rounded-full border hover:bg-gray-100 text-sm"
                        >
              <span className="mr-2">
                {categories.find((c) => c.label === categoryLabel)?.emoji} {categoryLabel}
              </span>
                            <Icon icon="ri:arrow-down-s-line" className="w-4 h-4" />
                        </button>
                        {showCategoryMenu && (
                            <ul className="absolute left-0 mt-2 w-36 bg-white border rounded shadow-lg z-10 max-h-60 overflow-auto">
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
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setShowSortMenu((v) => !v)}
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
                            <ul className="absolute left-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
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

                    {/* 검색 버튼 + 입력창 (필터 영역 내부) */}
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setShowSearchInput((v) => !v)}
                            className="p-2 rounded hover:bg-gray-100"
                        >
                            <Icon icon="ri:search-line" className="w-6 h-6 text-gray-600" />
                        </button>
                        {showSearchInput && (
                            <div className="absolute right-0 mt-2 bg-white border rounded shadow p-2 flex items-center">
                                {/* 1) 입력창 영역 */}
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        placeholder="상품명 검색"
                                        className="w-full border rounded px-3 py-1 pr-8"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSearch();
                                        }}
                                    />
                                    {inputValue && (
                                        <button
                                            onClick={() => setInputValue("")}
                                            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                                        >
                                            <Icon icon="ri:close-line" className="w-4 h-4 text-gray-600" />
                                        </button>
                                    )}
                                </div>
                                {/* 2) 검색 실행 버튼 */}
                                <button
                                    onClick={handleSearch}
                                    className="ml-2 p-2 rounded hover:bg-gray-100"
                                >
                                    <Icon icon="ri:search-line" className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 상품 리스트 */}
            <ListComponent
                products={products}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
        </>
    );
}
