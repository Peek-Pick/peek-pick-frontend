import { Link } from "react-router";
import type { PointStoreListDTO } from "~/types/points/points";

interface Props {
    products: PointStoreListDTO[];
    page: number;
    size: number;
    totalElements: number;
    setPage: (page: number) => void;
}

export default function ListComponent({ products, page, size, totalElements, setPage }: Props) {

    const totalPages = Math.ceil(
        (Number.isFinite(totalElements) && totalElements >= 0 ? totalElements : 0) /
        (Number.isFinite(size) && size > 0 ? size : 1)
    );

    const onPageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
    };

    console.log(products)

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">📦 상품 목록</h2>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full table-auto text-sm text-gray-700">
                    <thead className="bg-gray-100 border-b text-left">
                    <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">이미지</th>
                        <th className="px-4 py-3">상품명</th>
                        <th className="px-4 py-3">가격</th>
                        <th className="px-4 py-3">타입</th>
                        <th className="px-4 py-3">상세 보기</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                                등록된 상품이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr key={product.pointstoreId} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">{product.pointstoreId}</td>
                                <td className="px-4 py-3">
                                    <img
                                        src={`http://localhost:8080/uploads/${product.imgUrl}`}
                                        alt={product.item}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="px-4 py-3">{product.item}</td>
                                <td className="px-4 py-3">{product.price.toLocaleString()}P</td>
                                <td className="px-4 py-3">{product.productType}</td>
                                <td className="px-4 py-3">
                                    <Link
                                        to={`/admin/points/read/${product.pointstoreId}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        상세
                                    </Link>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

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
        </div>
    );
}
