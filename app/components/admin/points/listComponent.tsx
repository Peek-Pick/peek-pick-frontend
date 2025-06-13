import { useNavigate } from "react-router";
import type { PointStoreListDTO } from "~/types/points";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

interface Props {
    products: PointStoreListDTO[];
}

export default function ListComponent({ products}: Props) {

    const navigate = useNavigate();

    const goDetail = (id: number) => {
        navigate(`/admin/points/read/${id}`);
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faCartShopping} /> 포인트 상품 관리
            </h3>
            {/* 상품 추가 버튼 */}
            <div className="max-w-7xl mx-auto px-4 mb-4 flex justify-end">
                <button
                    onClick={() => navigate("/admin/points/add")}
                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 transition"
                >
                    <svg
                        className="w-4 h-4"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                            fill="currentColor"
                        />
                    </svg>
                    상품 추가
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                    <table className="min-w-full text-sm divide-y divide-gray-200"> {/* 글자 크기 줄이기 */}
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">타입</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                                    등록된 상품이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr
                                    key={product.pointstoreId}
                                    className="hover:bg-gray-100 cursor-pointer text-sm"
                                    onClick={() => goDetail(product.pointstoreId)}
                                >
                                    <td className="px-6 py-4">{product.pointstoreId}</td>
                                    <td className="px-6 py-4">
                                        <img
                                            src={`http://localhost:8080/uploads/${product.imgUrl}`}
                                            alt={product.item}
                                            className="w-12 h-12 object-cover rounded"
                                        />
                                    </td>
                                    <td className="px-4 py-2">{product.item}</td>
                                    <td className="px-4 py-2">{product.price.toLocaleString()}P</td>
                                    <td className="px-4 py-2">{product.productType}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
