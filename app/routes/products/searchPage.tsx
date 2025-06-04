// src/routes/products/SearchPage.tsx
import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Icon } from "@iconify/react";
import ListComponent from "~/components/products/listComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import { searchProducts } from "~/api/productsAPI";
import type { PageResponse, ProductListDTO } from "~/types/products";

export default function SearchPage() {
    const size = 10;

    // ─────────────────────────────────────────────────────────────────────────
    // 1) 검색창 상태
    const [inputValue, setInputValue] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");

    // 2) 카테고리 드롭다운 상태
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

    // 카테고리 드롭다운 ref
    const categoryRef = useRef<HTMLDivElement>(null);

    // 3) 정렬 드롭다운 상태
    const sortOptions = [
        { label: "좋아요 순", icon: "ri:heart-fill", param: "likeCount,DESC", color: "text-red-500" },
        { label: "별점 순", icon: "ri:star-fill", param: "score,DESC", color: "text-yellow-400" },
    ] as const;
    type SortLabelType = typeof sortOptions[number]["label"];
    type SortParamType = typeof sortOptions[number]["param"];
    const [sortLabel, setSortLabel] = useState<SortLabelType>("좋아요 순");
    const [sortParam, setSortParam] = useState<SortParamType>("likeCount,DESC");
    const [showSortMenu, setShowSortMenu] = useState(false);

    // 정렬 드롭다운 ref
    const sortRef = useRef<HTMLDivElement>(null);

    // 4) 스크롤 시 “올릴 때”만 검색창+필터 바가 보이도록 제어하는 로직
    const [showFilters, setShowFilters] = useState(true);
    const lastScrollY = useRef(0);
    useEffect(() => {
        const handler = () => {
            const currentY = window.scrollY;
            // 스크롤을 내릴 때: showFilters = false → 숨김
            // 스크롤을 올릴 때: showFilters = true → 보임
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

    // 5) 화면 터치/클릭 시 드롭다운 닫기 로직
    useEffect(() => {
        const handleClickOutside = (ev: MouseEvent | TouchEvent) => {
            const target = ev.target as Node;

            // 카테고리 메뉴가 열려 있고, 클릭/터치 대상이 카테고리 영역 밖이면 닫기
            if (
                showCategoryMenu &&
                categoryRef.current &&
                !categoryRef.current.contains(target)
            ) {
                setShowCategoryMenu(false);
            }

            // 정렬 메뉴가 열려 있고, 클릭/터치 대상이 정렬 영역 밖이면 닫기
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

    // 6) 카테고리 파라미터 (전체 → 빈 문자열)
    const categoryParam = categoryLabel === "전체" ? "" : categoryLabel;

    // 7) React Query: 무한 스크롤로 검색 결과 가져오기
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useInfiniteQuery({
        queryKey: ["productsSearch", size, sortParam, categoryParam, searchKeyword] as const,
        queryFn: ({ pageParam = 0 }: { pageParam?: number }) =>
            searchProducts(
                pageParam,
                size,
                sortParam,
                categoryParam || undefined,
                searchKeyword || undefined
            ),
        enabled: searchKeyword.trim() !== "",
        getNextPageParam: (lastPage: PageResponse<ProductListDTO>) =>
            lastPage.number + 1 < lastPage.total_pages ? lastPage.number + 1 : undefined,
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000,
    });

    // 8) 검색 실행 함수
    const handleSearch = () => {
        const kw = inputValue.trim();
        if (kw !== "") {
            setSearchKeyword(kw);
        }
    };

    // 9) 필터(카테고리/정렬) 또는 검색어가 변경되면 스크롤을 최상단으로 올려주는 로직
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [searchKeyword, categoryLabel, sortParam]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ───────────────────────────────────────────────────────────────────────
              1) 검색창 + 필터 바 전체를 묶은 컨테이너
              - showFilters가 true일 때 화면 상단에 “translate-y-0” (보임)
              - false일 때 “-translate-y-full” (숨김)
              - 부드러운 애니메이션 : transition-transform duration-300 ease-in-out
         ─────────────────────────────────────────────────────────────────────── */}
            <div
                className={`
          sticky top-16 z-40 bg-white transition-transform duration-300 ease-in-out
          ${showFilters ? "translate-y-0" : "-translate-y-full"}
        `}
            >
                {/* ─────────────────────────────────────────────────────────────────────
              1-1) 검색창 (가로로 넓게)
           ───────────────────────────────────────────────────────────────────── */}
                <div className="px-4 py-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="상품명 검색"
                            className="w-full border rounded-lg px-4 py-2 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                </div>

                {/* ─────────────────────────────────────────────────────────────────────
              1-2) 검색창 아래 필터 바 (카테고리 + 정렬)
              - 두 블럭 사이에 구분선(border) 없음
              - 같은 줄에 카테고리, 정렬 버튼 flex로 배치
           ───────────────────────────────────────────────────────────────────── */}
                <div className="px-4 pb-2">
                    <div className="flex items-center space-x-2">
                        {/* 카테고리 드롭다운 (flex-1으로 너비 균등) */}
                        <div ref={categoryRef} className="relative inline-block text-left flex-1">
                            <button
                                onClick={() => {
                                    setShowCategoryMenu((v) => !v);
                                    setShowSortMenu(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 text-sm"
                            >
                <span className="flex items-center">
                  <span className="mr-1">
                    {categories.find((c) => c.label === categoryLabel)?.emoji}
                  </span>
                  <span>{categoryLabel}</span>
                </span>
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
                                                }}
                                                className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                    categoryLabel === label ? "font-bold" : ""
                                                }`}
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
                        <div ref={sortRef} className="relative inline-block text-left flex-1">
                            <button
                                onClick={() => {
                                    setShowSortMenu((v) => !v);
                                    setShowCategoryMenu(false);
                                }}
                                className="w-full flex items-center justify-between px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 text-sm"
                            >
                <span className="flex items-center">
                  <Icon
                      icon={sortOptions.find((s) => s.label === sortLabel)!.icon}
                      className={`w-5 h-5 mr-1 ${sortOptions.find((s) => s.label === sortLabel)!.color}`}
                  />
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
                                                    setSortLabel(label);
                                                    setSortParam(param);
                                                    setShowSortMenu(false);
                                                }}
                                                className={`flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                                    sortLabel === label ? "font-bold" : ""
                                                }`}
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

            {/* ───────────────────────────────────────────────────────────────────────
            2) 로딩 / 에러 표시
         ─────────────────────────────────────────────────────────────────────── */}
            {isLoading && <div className="p-4 text-center">불러오는 중…</div>}
            {isError && (
                <div className="p-4 text-center text-red-500">
                    에러: {(error as Error).message}
                </div>
            )}

            {/* ───────────────────────────────────────────────────────────────────────
            3) 검색 결과 리스트 (ListComponent)
         ─────────────────────────────────────────────────────────────────────── */}
            {data && (
                <ListComponent
                    products={data.pages.flatMap((pg) => pg.content)}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                />
            )}

            {/* ───────────────────────────────────────────────────────────────────────
            4) 하단 네비게이션
         ─────────────────────────────────────────────────────────────────────── */}
            <BottomNavComponent />
        </div>
    );
}
