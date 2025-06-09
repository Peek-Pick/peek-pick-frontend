export interface FilterBarProps {
    category: string;
    setCategory: (value: string) => void;
    keyword: string;
    setKeyword: (value: string) => void;
    onSearch: () => void;
    hidden: boolean;
    setHidden: (value: boolean) => void;
}

function FilterBar({ category, setCategory, keyword, setKeyword, onSearch, hidden, setHidden }: FilterBarProps) {
    return (
        <div className="flex justify-between items-center mb-2 text-sm bg-white p-2">
            {/* 왼쪽: 검색 필터 */}
            <div className="flex items-center gap-2">
                <select
                    value={category}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setKeyword("");
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">전체</option>
                    <option value="reviewId">리뷰번호</option>
                    <option value="reviewerId">작성자번호</option>
                    <option value="userId">신고자번호</option>
                </select>

                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="키워드를 입력하세요"
                    className="border border-gray-300 rounded-lg px-4 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={category === "all"}
                />

                <button
                    onClick={onSearch}
                    className="bg-blue-600 text-white px-5 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                    disabled={category !== "all" && keyword.trim() === ""}
                >
                    검색
                </button>
            </div>

            {/* 오른쪽: 체크박스 */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="hiddenOnly"
                    checked={hidden}
                    onChange={(e) => setHidden(e.target.checked)}
                />
                <label htmlFor="hiddenOnly" className="text-sm text-gray-700">
                    숨김 리뷰만 보기
                </label>
            </div>
        </div>
    );
}

export default FilterBar;