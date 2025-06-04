import type { PointStoreListDTO } from "~/types/points";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'

interface Props {
    products: PointStoreListDTO[];
    page: number;
    size: number;
    totalElements: number;
    setPage: (page: number) => void;
    onProductClick: (product: PointStoreListDTO) => void;
}

export default function StoreListComponent({
                                               products,
                                               page,
                                               size,
                                               totalElements,
                                               setPage,
                                               onProductClick,
                                           }: Props) {
    const totalPages = Math.ceil(
        (Number.isFinite(totalElements) && totalElements >= 0 ? totalElements : 0) /
        (Number.isFinite(size) && size > 0 ? size : 1)
    );

    const onPageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
    };

    return (
        <div className="container mx-auto py-5 px-4">

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div
                        key={product.pointstoreId}
                        className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 relative"
                    >
                        <div className="relative">
                            <img
                                src={`http://localhost:8080/uploads/${product.imgUrl}`}
                                alt={product.item}
                                className="w-full h-28 object-cover rounded-t-lg"
                            />
                            {/* 구매 버튼 */}
                            <button
                                onClick={() => onProductClick(product)}
                                className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1.5 shadow hover:bg-blue-100 transition"
                            >
                                <FontAwesomeIcon icon={faShoppingBag} style={{ color: '#6b7280' }} />
                            </button>
                        </div>
                        <div className="p-3 flex flex-col">
                            <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                                {product.productType}
                            </span>
                            <h6 className="text-sm font-medium mb-1 truncate">{product.item}</h6>
                            <p className="text-yellow-500 font-semibold text-sm">{product.price} points</p>
                        </div>
                    </div>
                ))}
            </div>

            {/*페이지네이션*/}
            <nav aria-label="Page navigation" className="mt-8">
                <ul className="flex justify-center space-x-3">
                    {/* 이전 버튼 */}
                    <li>
                        <button
                            type="button"
                            onClick={() => onPageChange(page - 1)}
                            disabled={page === 0}
                            className={`
                                w-9 h-9 flex items-center justify-center
                                font-medium text-gray-500 transition-colors duration-200 relative
                                ${page === 0 ? "cursor-not-allowed opacity-50" : "hover:text-blue-600"}
                                focus:outline-none
                            `}
                            aria-disabled={page === 0}
                            aria-label="Previous page"
                        >
                            {/* 왼쪽 화살표 SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    </li>

                    {/* 페이지 번호 */}
                    {[...Array(totalPages)].map((_, i) => {
                        const isActive = i === page;
                        return (
                            <li key={i}>
                                <button
                                    type="button"
                                    onClick={() => onPageChange(i)}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`
                                        px-4 py-2 font-medium relative transition-colors duration-200
                                        ${
                                        isActive
                                            ? "text-gray-600 after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-yellow-400"
                                            : "text-gray-500 hover:text-gray-600"
                                    }
                                        focus:outline-none
                                    `}
                                >
                                    {i + 1}
                                </button>
                            </li>
                        );
                    })}

                    {/* 다음 버튼 */}
                    <li>
                        <button
                            type="button"
                            onClick={() => onPageChange(page + 1)}
                            disabled={page === totalPages - 1}
                            className={`
                                w-9 h-9 flex items-center justify-center
                                font-medium text-gray-500 transition-colors duration-200 relative
                                ${page === totalPages - 1 ? "cursor-not-allowed opacity-50" : "hover:text-blue-600"}
                                focus:outline-none
                            `}
                            aria-disabled={page === totalPages - 1}
                            aria-label="Next page"
                        >
                            {/* 오른쪽 화살표 SVG */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
