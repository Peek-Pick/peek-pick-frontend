export interface FilterBarProps {
    category: string;
    setCategory: (value: string) => void;
    keyword: string;
    setKeyword: (value: string) => void;
    onSearch: () => void;
    userStatus: string;
    setUserStatus: (value: string) => void;
    social: boolean;
    setSocial: (value: boolean) => void;
}

function UserFilterBar({ category, setCategory, keyword, setKeyword, onSearch, userStatus, setUserStatus, social, setSocial }: FilterBarProps) {
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
                    <option value="userId">유저번호</option>
                    <option value="email">이메일</option>
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
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <input
                        type="checkbox"
                        id="socialOnly"
                        checked={social}
                        onChange={(e) => setSocial(e.target.checked)}
                    />
                    <label htmlFor="socialOnly" className="text-sm text-gray-700">
                        소셜 계정만 보기
                    </label>
                </div>

                {/* status */}
                <select
                    value={userStatus}
                    onChange={(e) => setUserStatus(e.target.value)}
                    className=" flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">전체 상태</option>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="BANNED">BANNED</option>
                    <option value="DELETED">DELETED</option>
                </select>
            </div>
        </div>
    );
}

export default UserFilterBar;