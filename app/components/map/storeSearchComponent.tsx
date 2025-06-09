import { useState } from 'react';

interface StoreSearchProps {
    onSearch: (keyword: string) => void;
}

const StoreSearchComponent: React.FC<StoreSearchProps> = ({ onSearch }) => {
    const [keyword, setKeyword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyword.trim() !== '') {
            onSearch(keyword);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '10px' }}>
            <input
                type="text"
                placeholder="편의점 이름 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{ width: '300px', marginRight: '10px' }}
            />
            <button type="submit">검색</button>
        </form>
    );
};

export default StoreSearchComponent;
