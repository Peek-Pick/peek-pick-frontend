import type {PointStoreListDTO} from "~/types/points";


interface Props {
    products: PointStoreListDTO[];
    page: number;
    size: number;
    totalElements: number;
    setPage: (page: number) => void;
    onProductClick: (product: PointStoreListDTO) => void; // 상품 클릭 시 부모에 알림
}

export default function StoreListComponent ({products, page, size, totalElements, setPage, onProductClick}: Props) {

    const totalPages = Math.ceil(
        (Number.isFinite(totalElements) && totalElements >= 0 ? totalElements : 0) /
        (Number.isFinite(size) && size > 0 ? size : 1)
    );

    const onPageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">포인트 상점</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
                {products.map((product) => (
                    <div
                        key={product.pointstoreId}
                        className="border rounded p-4 flex flex-col cursor-pointer hover:shadow-md transition"
                        onClick={() => onProductClick(product)} // ✅ 클릭 시 이벤트
                    >
                        <img
                            src={`http://localhost:8080/uploads/${product.imgUrl}`}
                            alt={product.item}
                            className="w-full h-40 object-cover mb-2 rounded"
                        />
                        <h2 className="font-semibold text-lg">{product.item}</h2>
                        <p className="text-gray-600">가격: {product.price} 포인트</p>
                        <p className="text-gray-500 text-sm">{product.productType}</p>
                    </div>
                ))}
            </div>

            {/* 페이징 UI */}
            <nav className="flex justify-center mt-4 space-x-2">
                <button
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                >
                    이전
                </button>

                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i)}
                        className={`px-3 py-1 rounded border ${
                            i === page ? "bg-blue-600 text-white" : "hover:bg-gray-200"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}

                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => onPageChange(page + 1)}
                    className="px-3 py-1 rounded border disabled:opacity-50"
                >
                    다음
                </button>
            </nav>
        </div>
    );
}