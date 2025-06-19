// src/components/products/DetailComponent.tsx
import { useState } from "react";
import { Icon } from "@iconify/react";
import type { ProductDetailDTO } from "~/types/products";
import { toggleProductLike } from "~/api/products/productsAPI";
import { ProductLoading } from "~/util/loading/productLoading";

interface Props {
    product?: ProductDetailDTO;
    isLoading: boolean;
    isError: boolean;
}

export default function DetailComponent({ product, isLoading, isError }: Props) {
    // 1) 초기 로딩
    if (isLoading) {
        return <ProductLoading />;
    }
    // 2) 에러 또는 데이터 없음
    if (isError || !product) {
        return (
            <p className="text-center p-4 text-red-500 text-base sm:text-lg">
                상품 정보를 불러오지 못했습니다.
            </p>
        );
    }
    // 3) 삭제된 상품
    if (product.isDelete) {
        return (
            <div className="p-4 text-center text-gray-500">
                삭제된 상품입니다.
            </div>
        );
    }

    // 4) 정상 렌더링
    const [liked, setLiked] = useState(product.isLiked);
    const [count, setCount] = useState(product.likeCount ?? 0);

    const handleToggleLike = async () => {
        //optimistic update
        const newLiked = !liked;
        setLiked(newLiked);
        setCount((prev) => (newLiked ? prev + 1 : prev - 1));

        try {
            await toggleProductLike(product.barcode);
        } catch (error) {
            // 롤백
            setLiked(liked);
            setCount((prev) => (newLiked ? prev - 1 : prev + 1));
            console.error("좋아요 요청 실패", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 space-y-6">
            {/* 1. 이미지 */}
            <div className="flex justify-center">
                {product.imgUrl && (
                    <img
                        src={`http://localhost${product.imgUrl}`}
                        alt={product.name}
                        className="w-full max-w-sm h-auto object-cover rounded-lg border border-gray-200"
                    />
                )}
            </div>

            {/* 2~4. 상품명 + 좋아요·별점 */}
            <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h1 className="text-xl font-bold">{product.name}</h1>
                <div className="mt-3 flex items-center space-x-6 text-xl">
                    <button
                        type="button"
                        className="flex items-center focus:outline-none"
                        onClick={handleToggleLike}
                    >
                        <Icon
                            icon="ri:heart-fill"
                            className={`w-6 h-6 ${liked ? "text-red-500" : "text-gray-400"}`}
                        />
                        <span className="ml-2 font-semibold">{count}</span>
                    </button>
                    <div className="flex items-center">
                        <Icon icon="ri:star-fill" className="w-6 h-6 text-yellow-400" />
                        <span className="ml-2 font-semibold">
              {product.score?.toFixed(1) ?? "0.0"} ({product.reviewCount ?? 0})
            </span>
                    </div>
                </div>
            </div>

            {/* 5. 상품 정보 */}
            <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
                <h2 className="text-lg font-semibold">상품 정보</h2>
                <div className="space-y-3 text-gray-700">
                    <div>
                        <p className="text-base font-bold">바코드</p>
                        <p className="text-sm">{product.barcode}</p>
                    </div>
                    <div>
                        <p className="text-base font-bold">상세 설명</p>
                        <p className="text-sm">{product.description ?? "-"}</p>
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
        </div>
    );
}
