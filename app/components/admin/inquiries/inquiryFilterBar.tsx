import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export interface InquiryFilterBarProps {
    category: string;
    setCategory: (value: string) => void;
    keyword: string;
    setKeyword: (value: string) => void;
    waitingAnswerOnly: boolean;
    setWaitingAnswerOnly: (value: boolean) => void;
    includeDeleted: boolean;
    setIncludeDeleted: (value: boolean) => void;
    onSearch: () => void;
}

function InquiryFilterBar({
                              category,
                              setCategory,
                              keyword,
                              setKeyword,
                              waitingAnswerOnly,
                              setWaitingAnswerOnly,
                              includeDeleted,
                              setIncludeDeleted,
                              onSearch,
                          }: InquiryFilterBarProps) {
    const [localCategory, setLocalCategory] = useState(category);
    const [localKeyword, setLocalKeyword] = useState(keyword);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => setLocalCategory(category), [category]);
    useEffect(() => setLocalKeyword(keyword), [keyword]);

    // ✅ 공통 쿼리 파라미터 업데이트 함수
    const updateSearchParams = (updateFn: (params: URLSearchParams) => void) => {
        const newParams = new URLSearchParams(searchParams);
        updateFn(newParams);
        navigate(`?${newParams.toString()}`, { replace: false });
    };

    // ✅ 검색 버튼 클릭 핸들러
    const handleSearchClick = () => {
        setCategory(localCategory);
        setKeyword(localKeyword);
        updateSearchParams((params) => {
            params.set('category', localCategory);
            params.set('keyword', localKeyword);
            params.set('page', '0');
        });
        onSearch();
    };

    const handleWaitingChange = (checked: boolean) => {
        setWaitingAnswerOnly(checked);
        updateSearchParams((params) => {
            params.set('waiting', checked.toString());
            params.set('page', '0');
        });
        onSearch();
    };

    const handleIncludeDeletedChange = (checked: boolean) => {
        setIncludeDeleted(checked);
        updateSearchParams((params) => {
            params.set('includeDeleted', checked.toString());
            params.set('page', '0');
        });
        onSearch();
    };

    return (
        <div className="flex justify-between items-center mb-2 text-sm bg-white p-2">
            <div className="flex items-center gap-2">
                <select
                    value={localCategory}
                    onChange={(e) => setLocalCategory(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">전체</option>
                    <option value="content">본문</option>
                    <option value="writer">닉네임</option>
                    <option value="inquiryId">문의번호</option>
                </select>

                <input
                    type="text"
                    value={localKeyword}
                    onChange={(e) => setLocalKeyword(e.target.value)}
                    placeholder="키워드를 입력하세요"
                    className="border border-gray-300 rounded-lg px-4 py-1.5 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleSearchClick}
                    className="bg-blue-600 text-white px-5 py-1.5 rounded-lg hover:bg-blue-700 transition"
                >
                    검색
                </button>
            </div>

            <div className="flex items-center gap-4">
                <label className="flex items-center gap-1 text-gray-700">
                    <input
                        type="checkbox"
                        checked={waitingAnswerOnly}
                        onChange={(e) => handleWaitingChange(e.target.checked)}
                    />
                    답변 대기만 보기
                </label>

                <label className="flex items-center gap-1 text-gray-700">
                    <input
                        type="checkbox"
                        checked={!includeDeleted}
                        onChange={(e) => handleIncludeDeletedChange(!e.target.checked)}
                    />
                    삭제된 문의 제외
                </label>
            </div>
        </div>
    );
}

export default InquiryFilterBar;