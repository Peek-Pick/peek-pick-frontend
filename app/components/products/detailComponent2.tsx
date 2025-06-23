import { useState } from "react";
import { Icon } from "@iconify/react";
import type { ProductDetailDTO } from "~/types/products";
import { toggleProductLike } from "~/api/products/productsAPI";
import { ProductLoading } from "~/util/loading/productLoading";
import DetailReadMoreModal from "~/components/products/detailReadMoreModal";

interface Props {
    product?: ProductDetailDTO;
    isLoading: boolean;
    isError: boolean;
}

export default function DetailComponent2({ product, isLoading, isError }: Props) {
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

    // 모달 제어
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <section className="relative">
                <div className="w-full max-w-7xl md:px-5 lg-6 mx-auto">
                    <div className="w-full">
                        <div className="flex flex-row flex-nowrap items-center bg-white rounded-2xl shadow-sm transition-all duration-500 w-full overflow-hidden mb-7">
                            <div className="w-38 h-38 flex-shrink-0 overflow-hidden rounded-l-2xl">
                                <img
                                    src={`http://localhost${product.imgUrl}`}
                                    alt="Product image"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-4 w-full">
                                <h4 className="text-base font-semibold text-gray-900 mb-2 capitalize transition-all duration-500 w-full ">{product.name}</h4>
                                <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 mb-2 w-full"> {product.description ?? "-"} </p>

                                <div className="flex justify-between items-center text-sm sm:text-base mt-3">
                                    {/* 좋아요 버튼 */}
                                    <button
                                        onClick={handleToggleLike}
                                        // disabled={toggleLikeMutation.isPending}
                                        className={`flex items-center gap-1 px-2 py-1 rounded-full border font-medium text-xs sm:text-xs
                                            ${liked
                                                                ? "bg-red-50 text-red-500 border-red-200"
                                                                : "bg-gray-100 text-gray-500 border-gray-200"} 
                                            hover:shadow-sm transition-colors duration-200`}
                                                        >
                                                            {liked ? '❤️' : '🤍'} Like {count}
                                    </button>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="text-red-500 hover:text-red-600 transition text-sm sm:text-sm duration-200">
                                        Read More
                                    </button>
                                </div>

                                {showModal && (
                                    <DetailReadMoreModal
                                        product={product}
                                        onClose={() => setShowModal(false)}
                                    />
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
