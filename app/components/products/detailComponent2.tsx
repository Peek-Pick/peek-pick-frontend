import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import type { ProductDetailDTO, ProductListDTO, PageResponseCursor } from "~/types/products";
import { toggleProductLike } from "~/api/products/productsAPI";
import { ProductLoading } from "~/util/loading/productLoading";
import DetailReadMoreModal from "~/components/products/detailReadMoreModal";

interface Props {
    product?: ProductDetailDTO;
    isLoading: boolean;
    isError: boolean;
}

export default function DetailComponent2({ product, isLoading, isError }: Props) {
    if (isLoading) return <ProductLoading />;
    if (isError || !product) {
        return (
            <p className="text-center p-4 text-red-500 text-base sm:text-lg">
                상품 정보를 불러오지 못했습니다.
            </p>
        );
    }
    if (product.isDelete) {
        return (
            <div className="p-4 text-center text-gray-500">
                삭제된 상품입니다.
            </div>
        );
    }

    const queryClient = useQueryClient();
    const [liked, setLiked] = useState(product.isLiked);
    const [count, setCount] = useState(product.likeCount ?? 0);
    const [showModal, setShowModal] = useState(false);

    // ✅ 상세 진입 시 캐시에서 최신 정보 덮어쓰기 (방어 로직 포함)
    useEffect(() => {
        const cachedProduct = queryClient
            .getQueryCache()
            .findAll({
                predicate: (q) =>
                    ["recommended", "productsRanking", "searchProducts"].includes(String(q.queryKey[0])),
            })
            .flatMap((q) => {
                const data = queryClient.getQueryData(q.queryKey);
                if (
                    data &&
                    typeof data === "object" &&
                    "pages" in data &&
                    Array.isArray((data as any).pages)
                ) {
                    return (data as InfiniteData<PageResponseCursor<ProductListDTO>>).pages.flatMap(
                        (p) => p.content
                    );
                }
                return [];
            })
            .find((p) => p.barcode === product.barcode);

        if (cachedProduct) {
            setLiked(cachedProduct.isLiked);
            setCount(cachedProduct.likeCount ?? 0);
        }
    }, []);

    const mutation = useMutation({
        mutationFn: () => toggleProductLike(product.barcode),
        onMutate: async () => {
            const newLiked = !liked;
            const newCount = newLiked ? count + 1 : count - 1;

            // 1. 낙관적 UI 반영
            setLiked(newLiked);
            setCount(newCount);

            // 2. 캐시 낙관적 수정
            const previousCaches = queryClient.getQueryCache().findAll({
                predicate: (q) =>
                    ["recommended", "productsRanking", "searchProducts"].includes(String(q.queryKey[0])),
            });

            previousCaches.forEach(({ queryKey }) => {
                queryClient.setQueryData<InfiniteData<PageResponseCursor<ProductListDTO>>>(queryKey, (oldData) => {
                    if (!oldData || !Array.isArray(oldData.pages)) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            content: page.content.map((p) =>
                                p.barcode === product.barcode
                                    ? {
                                        ...p,
                                        isLiked: newLiked,
                                        likeCount: (p.likeCount ?? 0) + (newLiked ? 1 : -1),
                                    }
                                    : p
                            ),
                        })),
                        pageParams: oldData.pageParams,
                    };
                });
            });

            return { newLiked, previousCaches };
        },
        onError: (error, _, context) => {
            const { newLiked, previousCaches } = context ?? {};

            // 1. UI rollback
            setLiked(!newLiked);
            setCount((prev) => (newLiked ? prev - 1 : prev + 1));

            // 2. 캐시 rollback
            previousCaches?.forEach(({ queryKey }) => {
                queryClient.invalidateQueries({ queryKey });
            });

            console.error("좋아요 요청 실패", error);
        },
    });

    const handleToggleLike = () => {
        mutation.mutate();
    };

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
                                <h4 className="text-base font-semibold text-gray-900 mb-2 capitalize transition-all duration-500 w-full ">
                                    {product.name}
                                </h4>
                                <p className="text-sm font-normal text-gray-500 transition-all duration-500 leading-5 mb-2 w-full">
                                    {product.description ?? "-"}
                                </p>

                                <div className="flex justify-between items-center text-sm sm:text-base mt-3">
                                    <button
                                        onClick={handleToggleLike}
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
                                        className="text-red-500 hover:text-red-600 transition text-sm sm:text-sm duration-200"
                                    >
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
