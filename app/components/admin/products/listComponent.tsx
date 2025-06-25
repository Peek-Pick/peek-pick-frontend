import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import type { ProductListDTO } from "~/types/products";
import LoadingComponent from "~/components/common/loadingComponent";

interface Props {
    data?: ProductListDTO[];
    isLoading?: boolean;
    isError?: boolean;
}

export default function AdminProductsListComponent({ data, isLoading, isError }: Props) {
    const navigate = useNavigate();

    if (isLoading)
        return <LoadingComponent isLoading />;
    if (isError || !data)
        return <div className="p-4 text-red-500">상품 목록 불러오기 실패</div>;

    return (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 align-middle">#</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 align-middle">이미지</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 align-middle">상품명 / 바코드</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 align-middle">좋아요·별점</th>
                    <th className="px-4 py-2 text-xs font-medium text-gray-500 align-middle">삭제여부</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                {data.length === 0 ? (
                    <tr>
                        <td colSpan={5} className="px-4 py-4 text-center text-gray-500 align-middle">
                            등록된 상품이 없습니다.
                        </td>
                    </tr>
                ) : (
                    data.map((p) => (
                        <tr
                            key={p.productId}
                            className="hover:bg-gray-100 cursor-pointer"
                            onClick={() => navigate(`/admin/products/${p.productId}`)}
                        >
                            <td className="px-4 py-3 align-middle">{p.productId}</td>

                            {/* 이미지 셀: 수평+수직 가운데 정렬 */}
                            <td className="px-4 py-3 align-middle">
                                <div className="flex justify-center items-center w-full h-full">
                                    {p.imgThumbUrl ? (
                                        <img
                                            src={`http://localhost${p.imgThumbUrl}`}
                                            alt={p.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            </td>

                            {/* 상품명/바코드 */}
                            <td className="px-4 py-3 align-middle text-left">
                                <div className="font-medium text-gray-900">{p.name}</div>
                                <div className="text-gray-500 text-xs">{p.barcode}</div>
                            </td>

                            {/* 좋아요/별점 */}
                            <td className="px-4 py-3 align-middle">
                                <div className="inline-flex items-center space-x-1">
                                    <FontAwesomeIcon icon={faHeart} className="w-5 h-5 text-red-500" />
                                    <span className="font-medium">{p.likeCount ?? 0}</span>
                                </div>
                                <div className="inline-flex items-center space-x-1 ml-4">
                                    <FontAwesomeIcon icon={faStar} className="w-5 h-5 text-yellow-400" />
                                    <span className="font-medium">
                                            {p.score?.toFixed(1) ?? "0.0"} ({p.reviewCount ?? 0})
                                        </span>
                                </div>
                            </td>

                            {/* 삭제여부 */}
                            <td className="px-4 py-3 align-middle">
                                    <span
                                        className={`text-sm font-semibold ${
                                            p.isDelete ? "text-red-600" : "text-black"
                                        }`}
                                    >
                                        {p.isDelete ? "삭제됨" : "-"}
                                    </span>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
