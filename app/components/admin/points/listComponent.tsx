import { useNavigate } from "react-router";
import type { PointStoreListDTO } from "~/types/points";

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

    const navigate = useNavigate();

    const onPageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
    };

    const goDetail = (id: number) => {
        navigate(`/admin/points/read/${id}`);
    };

    return (
        <div>
            <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="nc-icon nc-basket" /> 상품 목록
            </h4>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                등록된 상품이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        products.map((product) => (
                            <tr
                                key={product.pointstoreId}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => goDetail(product.pointstoreId)}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">{product.pointstoreId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <img
                                        src={`http://localhost:8080/uploads/${product.imgUrl}`}
                                        alt={product.item}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.item}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.price.toLocaleString()}P</td>
                                <td className="px-6 py-4 whitespace-nowrap">{product.productType}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <nav className="flex justify-center space-x-1 mt-4">
                <button
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-200"
                >
                    이전
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => onPageChange(i)}
                        className={`px-3 py-1 border rounded ${
                            i === page ? "bg-indigo-600 text-white" : "hover:bg-gray-200"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    disabled={page >= totalPages - 1}
                    onClick={() => onPageChange(page + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-200"
                >
                    다음
                </button>
            </nav>
        </div>
    );
}
