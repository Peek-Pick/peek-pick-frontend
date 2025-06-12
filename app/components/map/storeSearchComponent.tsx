import { useState } from 'react';
import { FaSearchLocation } from 'react-icons/fa';

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
        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4">
            <input
                type="text"
                placeholder="Search stores"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                <FaSearchLocation />
            </button>
        </form>
    );
};

export default StoreSearchComponent;
