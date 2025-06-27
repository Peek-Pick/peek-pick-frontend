import { useNavigate } from "react-router";
import type { PointStoreListDTO } from "~/types/points";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

interface Props {
    products: PointStoreListDTO[];
    page: number;
    category?: string;
    keyword?: string;
    hidden?: boolean
}

export default function ListComponent({ products, page, category, keyword, hidden }: Props) {

    const navigate = useNavigate();

    const goDetail = (id: number) => {
        navigate(`/admin/points/read/${id}?page=${page}&keyword=${keyword}&category=${category}&hidden=${hidden}`, {
            state: { from: 'pointsList' }});
    };

    return (
        <div>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이미지</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상품명</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가격</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">편의점명</th>
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
                                            src={`http://localhost/${product.imgUrl}`}
                                            alt={product.item}
                                            className="w-28 h-20 object-cover rounded-lg"
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
    );
}
