
// 검색창만 담당하는 컴포넌트

type SearchInputProps = {
    keyword: string;
    setKeyword: (v: string) => void;
    onSearch: () => void;
};

function mapSearchComponent({ keyword, setKeyword, onSearch }: SearchInputProps) {
    return (
        <div className="flex gap-2 mb-4">
            <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="편의점 이름을 입력하세요"
                className="flex-1 px-3 py-2 border rounded-md"
            />
            <button onClick={onSearch} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                검색
            </button>
        </div>
    );
}

export default mapSearchComponent;
