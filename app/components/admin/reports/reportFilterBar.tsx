export interface FilterBarProps {
    category: string;
    setCategory: (value: string) => void;
    keyword: string;
    setKeyword: (value: string) => void;
    onSearch: () => void;
}

function FilterBar({ category, setCategory, keyword, setKeyword, onSearch }: FilterBarProps) {
    return (
        <div className="flex items-center gap-2 mb-2 text-sm bg-white p-1 rounded-lg">
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
    );
}

export default FilterBar;