// src/routes/products/ListPage.tsx
import { useState, useEffect, useRef } from "react";
import {
    useInfiniteQuery,
    useQueryClient,
    type InfiniteData,
} from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import ListComponent from "~/components/products/listComponent";
import { listProducts } from "~/api/productsAPI";
import type { PageResponse, ProductListDTO } from "~/types/products";

export default function ProductListPage() {
    const size = 10;
    const queryClient = useQueryClient();

    // UI 상태
    const [categoryLabel, setCategoryLabel] = useState<
        "전체" | "과자류" | "아이스크림" | "햄버거" | "샐러드"
    >("전체");
    const [sortLabel, setSortLabel] = useState<"좋아요 순" | "별점 순">(
        "좋아요 순"
    );
    const [sortParam, setSortParam] = useState<"likeCount,DESC" | "score,DESC">(
        "likeCount,DESC"
    );

    const [inputValue, setInputValue] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);

    // 스크롤 토글 로직
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

    // '전체'인 경우 빈 문자열로 넘겨서 파라미터 생략되도록
    const categoryParam = categoryLabel === "전체" ? "" : categoryLabel;

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery<
        PageResponse<ProductListDTO>,
        Error,
        InfiniteData<PageResponse<ProductListDTO>, number>,
        readonly [
            "productsRanking",
            number,
            string,
            string,
            string
        ], number
    >({
        queryKey: [
            "productsRanking",
            size,
            sortParam,
            categoryParam,
            searchKeyword,
        ] as const,
        queryFn: ({ pageParam = 0 }) =>
            listProducts(
                pageParam,
                size,
                sortParam,
                categoryParam || undefined,
                searchKeyword || undefined
            ),
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
                에러: {error.message}
            </div>
        );
    }

    const infiniteData = data as InfiniteData<
        PageResponse<ProductListDTO>,
        number
    >;
    const products = infiniteData.pages.flatMap((pg) => pg.content);

    const categories = [
        "전체",
        "과자류",
        "아이스크림",
        "햄버거",
        "샐러드",
    ] as const;
    const sortOptions = [
        { label: "좋아요 순", icon: "ri:heart-fill", param: "likeCount,DESC" },
        { label: "별점 순", icon: "ri:star-fill", param: "score,DESC" },
    ] as const;

    // 검색 실행 (검색창 닫기 추가)
    const handleSearch = () => {
        setSearchKeyword(inputValue.trim());
        setShowSearchInput(false);
        // // 필요하다면 쿼리 캐시 초기화
        // queryClient.resetQueries(["productsRanking"]);
    };

    return (
        <>
            {/* A: 제목 + 검색 아이콘 */}
            <div className="sticky top-0 bg-white z-50 border-b relative">
                <div className="flex justify-between items-center px-4 py-4">
                    <h1 className="text-2xl font-bold">상품 랭킹</h1>
                    <button
                        onClick={() => setShowSearchInput((v) => !v)}
                        className="p-2 rounded hover:bg-gray-100"
                    >
                        <Icon icon="ri:search-line" className="w-6 h-6 text-gray-600" />
                    </button>
                </div>
                {showSearchInput && (
                    <div className="absolute top-full right-4 mt-2 bg-white border rounded shadow p-2 flex items-center space-x-2">
                        <input
                            type="text"
                            placeholder="상품명 검색"
                            className="border rounded px-3 py-1"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                        />
                        <button
                            onClick={handleSearch}
                            className="p-2 rounded hover:bg-gray-100"
                        >
                            <Icon icon="ri:search-line" className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                )}
            </div>

            {/* B: 필터 영역 */}
            <div
                className={`
          sticky top-16 bg-white z-40 border-b
          transform transition-transform duration-200
          ${showFilters ? "translate-y-0" : "-translate-y-full"}
        `}
            >
                <div className="flex justify-between items-center px-4 py-2">
                    {/* 카테고리 탭 */}
                    <div className="flex space-x-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategoryLabel(cat)}
                                className={`
                  px-3 py-1 rounded-full text-sm
                  ${
                                    categoryLabel === cat
                                        ? "bg-gray-200 text-gray-800 font-bold"
                                        : "bg-transparent text-gray-700 font-normal"
                                }
                `}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* 정렬 드롭다운 */}
                    <div className="relative inline-block text-left">
                        <button
                            onClick={() => setShowSortMenu((v) => !v)}
                            className="flex items-center px-4 py-2 rounded-full text-sm border hover:bg-gray-100"
                        >
              <span
                  className={`
                  inline-block w-5 h-5 text-center mr-2
                  ${
                      sortLabel === "좋아요 순"
                          ? "text-red-500"
                          : "text-yellow-400"
                  }
                `}
              >
                <Icon
                    icon={
                        sortLabel === "좋아요 순"
                            ? "ri:heart-fill"
                            : "ri:star-fill"
                    }
                    className="w-full h-full"
                />
              </span>
                            <span>{sortLabel}</span>
                        </button>

                        {showSortMenu && (
                            <ul className="absolute right-0 mt-2 min-w-max bg-white border rounded shadow-lg z-10">
                                {sortOptions.map(({ label, icon, param }) => (
                                    <li key={label}>
                                        <button
                                            onClick={() => {
                                                setSortLabel(label);
                                                setSortParam(param);
                                                setShowSortMenu(false);
                                            }}
                                            className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                      <span
                          className={`
                          inline-block w-5 h-5 text-center mr-2
                          ${
                              icon === "ri:heart-fill"
                                  ? "text-red-500"
                                  : "text-yellow-400"
                          }
                        `}
                      >
                        <Icon icon={icon} className="w-full h-full" />
                      </span>
                                            <span>{label}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
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
