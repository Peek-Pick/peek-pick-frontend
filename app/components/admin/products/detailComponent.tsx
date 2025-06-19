import { Link } from "react-router-dom";
import type { ProductDetailDTO } from "~/types/products";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faStar } from "@fortawesome/free-solid-svg-icons";

interface Props {
    product: ProductDetailDTO;
}

export default function AdminProductDetailComponent({ product }: Props) {
    return (
        <>
            <h2 className="text-xl font-bold mb-6 border-b pb-2">
                상품 상세
            </h2>

            {/* 1. 이미지 */}
            <div className="flex justify-center mb-6">
                {product.imgUrl ? (
                    <img
                        src={`http://localhost${product.imgUrl}`}
                        alt={product.name}
                        className="max-w-full h-auto object-cover rounded-lg border border-gray-100"
                        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                    />
                ) : (
                    <div className="w-full h-60 bg-gray-100 flex items-center justify-center text-gray-400 rounded-lg">
                        No Image
                    </div>
                )}
            </div>

            {/* 2. 상품명 + 좋아요·별점 */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {product.name}
                </h3>
                <div className="mt-2 flex items-center space-x-4">
                    <div className="inline-flex items-center space-x-1">
                        <FontAwesomeIcon
                            icon={faHeart}
                            className="w-5 h-5 text-red-500"
                        />
                        <span className="font-medium">{product.likeCount ?? 0}</span>
                    </div>
                    <div className="inline-flex items-center space-x-1">
                        <FontAwesomeIcon
                            icon={faStar}
                            className="w-5 h-5 text-yellow-400"
                        />
                        <span className="font-medium">
              {product.score?.toFixed(1) ?? "0.0"} ({product.reviewCount ?? 0})
            </span>
                    </div>
                </div>
            </div>

            {/* 3. 상품 기본 정보 (바코드 포함) */}
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 mb-6">
                <h3 className="text-lg font-semibold mb-4">상품 정보</h3>
                <div className="space-y-4 text-gray-700">
                    <div>
                        <p className="text-base font-bold">바코드</p>
                        <p className="text-sm">{product.barcode}</p>
                    </div>
                    <div>
                        <p className="text-base font-bold">설명</p>
                        <p className="text-sm whitespace-pre-line">
                            {product.description ?? "-"}
                        </p>
                    </div>
                    <div>
                        <p className="text-base font-bold">카테고리</p>
                        <p className="text-sm">{product.category ?? "-"}</p>
                    </div>
                    <div>
                        <p className="text-base font-bold">용량</p>
                        <p className="text-sm">{product.volume ?? "-"}</p>
                    </div>
                    <div>
                        <p className="text-base font-bold">원재료</p>
                        <p className="text-sm">{product.ingredients ?? "-"}</p>
                    </div>
                    <div>
                        <p className="text-base font-bold">알레르기 정보</p>
                        <p className="text-sm">{product.allergens ?? "-"}</p>
                    </div>
                    <div>
                        <p className="text-base font-bold">영양 성분</p>
                        <p className="text-sm">{product.nutrition ?? "-"}</p>
                    </div>
                </div>
            </div>

            {/* 4. 액션 버튼 */}
            <div className="mt-8 flex gap-3 justify-end">
                <Link
                    to={`/admin/products/${product.productId}/edit`}
                    className="flex items-center gap-1 rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-100 transition"
                >
                    수정
                </Link>
                <Link
                    to="/admin/products/list"
                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition"
                >
                    목록으로
                </Link>
            </div>
        </>
    );
}
