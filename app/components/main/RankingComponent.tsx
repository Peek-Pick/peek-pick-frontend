import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { PagingResponse } from "~/types/common";
import type { ProductListDTO } from "~/types/products";
import { listProducts } from "~/api/products/productsAPI";
import { Icon } from "@iconify/react";

export function RankingComponent() {
    const navigate = useNavigate();

    const size = 10;
    const page = 0;
    const sortParam = "score,DESC";

    const { data, isLoading, isError } = useQuery<PagingResponse<ProductListDTO>>({
        queryKey: ["productsRanking", page, size, sortParam],
        queryFn: () => listProducts(page, size, sortParam),
        staleTime: 1000 * 60 * 5,
    });

    const ranking = data?.content ?? [];

    return (
        <section className="px-4 py-4 bg-white">
            {/* 섹션 제목 및 '더보기' 버튼 */}
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Top Ranking</h2>
                <button
                    onClick={() => navigate("/products/ranking")}
                    className="text-sm text-gray-800 hover:underline"
                >
                    More &gt;
                </button>
            </div>

            {/* 가로 스크롤 가능한 랭킹 리스트 */}
            <div
                className="overflow-x-auto no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <div className="flex gap-2" >
                    {ranking.map((item, index) => (
                        <div
                            key={item.productId}
                            className="relative min-w-[160px] flex-shrink-0 bg-white border border-[#eee] rounded-xl shadow-md p-2 cursor-pointer transition hover:shadow-lg"
                            onClick={() => navigate(`/products/${item.barcode}`)}
                        >
                            {/* ✅ BEST 랭킹 표시 뱃지 (원형 스타일) */}
                            <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full bg-[#ff5e5e] text-white text-xs font-bold z-10">
                                {index + 1}
                            </div>

                            {/* 상품 이미지 영역 (고정 크기 140x140) */}
                            <div className="w-[140px] h-[140px] mb-3 bg-[#F9F9F9] rounded-md overflow-hidden flex items-center justify-center">
                                {item.imgUrl ? (
                                    <img
                                        src={item.imgUrl}
                                        alt={item.name}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-gray-300 text-sm">No Image</div>
                                )}
                            </div>

                            {/* 상품명 */}
                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                                {item.name}
                            </h3>

                            {/* 좋아요 및 별점 */}
                            <div className="flex items-center text-xs text-gray-600 space-x-3 mb-1">
                            <span className="flex items-center">
                                <Icon icon="ri:heart-fill" className="text-red-500 w-4 h-4 mr-1" />
                                {item.likeCount ?? 0}
                            </span>
                                <span className="flex items-center">
                                <Icon icon="ri:star-fill" className="text-yellow-400 w-4 h-4 mr-1" />
                                    {item.score?.toFixed(1) ?? "0.0"}
                            </span>
                            </div>

                            {/* 리뷰 개수 */}
                            <div className="text-[12px] text-gray-400 mb-1">
                                {item.reviewCount ?? 0} reviews
                            </div>

                            {/* 카테고리 표시 */}
                            {item.category && (
                                <div className="text-[11px] text-gray-500 uppercase">
                                    {item.category}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}