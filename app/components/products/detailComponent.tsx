// app/components/products/detailComponent.tsx

import type { ProductDetailDTO } from "~/types/products";
import ReviewPlaceholder from "~/components/reviews/userListComponent"; // 실제 리뷰 컴포넌트 자리에 임시로 렌더링

interface Props {
    product: ProductDetailDTO;
}

export default function DetailComponent({ product }: Props) {
    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            {/* 1. 최상단: 상품 이미지 & 상품명 */}
            <div className="flex flex-col items-center">
                {product.img_url && (
                    <img
                        src={product.img_url}
                        alt={product.name}
                        className="w-full max-w-sm h-auto object-cover rounded-lg"
                    />
                )}
                <h1 className="mt-4 text-2xl font-bold">{product.name}</h1>
            </div>

            {/* 2. 상품 정보 박스 */}
            <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
                {/* 좋아요 표시 */}
                <div className="flex items-center text-red-500 text-xl">
                    <span className="mr-1">❤️</span>
                    <span className="font-medium">{product.like_count ?? 0}</span>
                </div>

                {/* 상품 정보 제목 */}
                <h2 className="text-lg font-semibold">상품 정보</h2>

                {/* 상세 정보 리스트 */}
                <div className="space-y-2 text-gray-700">
                    <div>
                        <p className="font-medium">바코드</p>
                        <p>{product.barcode}</p>
                    </div>
                    <div>
                        <p className="font-medium">상세 설명</p>
                        <p>{product.description ?? "-"}</p>
                    </div>
                    <div>
                        <p className="font-medium">카테고리</p>
                        <p>{product.category ?? "-"}</p>
                    </div>
                    <div>
                        <p className="font-medium">용량</p>
                        <p>{product.volume ?? "-"}</p>
                    </div>
                    <div>
                        <p className="font-medium">원재료</p>
                        <p>{product.ingredients ?? "-"}</p>
                    </div>
                    <div>
                        <p className="font-medium">알레르기 정보</p>
                        <p>{product.allergens ?? "-"}</p>
                    </div>
                    <div>
                        <p className="font-medium">영양 성분</p>
                        <p>{product.nutrition ?? "-"}</p>
                    </div>
                </div>
            </div>

            {/* 3. 리뷰 화면 자리 표시용 */}
            <div className="border rounded-lg p-4 bg-gray-50 text-center text-gray-500">
                리뷰 화면
            </div>
        </div>
    );
}
