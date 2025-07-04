import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import type { ProductListDTO, PageResponseCursor } from "~/types/products";
import { getRanking } from "~/api/products/productsAPI";
import { Icon } from "@iconify/react";
import { useEffect, useRef } from "react";
import {useTranslation} from "react-i18next";

export function RankingComponent() {
    // 국제화 적용
    const { t } = useTranslation();

    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    const size = 10;
    const sortKey = "score,DESC";

    const { data, isLoading, isError } = useQuery<PageResponseCursor<ProductListDTO>>({
        queryKey: ["productsRanking", size, sortKey],
        queryFn: () => getRanking(size, undefined, undefined, undefined, sortKey),
        staleTime: 1000 * 60 * 5,
    });

    const ranking = data?.content ?? [];

    // 자동 슬라이드 기능
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollAmount = (160 + 8) * 2; // item width + gap (min-w-[160px] + gap-2 => 0.5rem = 8px)

        const interval = setInterval(() => {
            if (!container) return;

            const maxScrollLeft = container.scrollWidth - container.clientWidth;
            if (container.scrollLeft + scrollAmount >= maxScrollLeft) {
                container.scrollTo({ left: 0, behavior: "smooth" }); // 처음으로
            } else {
                container.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="px-4 py-4 bg-white">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{t('mainTopRanking')}</h2>
                <button
                    onClick={() => navigate("/products/ranking")}
                    className="text-sm text-gray-800 hover:underline"
                >
                    {t('moreButton')} &gt;
                </button>
            </div>

            <div
                ref={containerRef}
                className="overflow-x-auto no-scrollbar"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                <div className="flex gap-2">
                    {ranking.map((item, index) => (
                        <div
                            key={item.productId}
                            className="relative min-w-[160px] flex-shrink-0 bg-white border border-[#eee] rounded-xl shadow-md p-2 cursor-pointer transition hover:shadow-lg"
                            onClick={() => navigate(`/products/${item.barcode}`)}
                        >
                            <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full bg-[#ff5e5e] text-white text-xs font-bold z-10">
                                {index + 1}
                            </div>
                            <div className="w-[140px] h-[140px] mb-3 bg-[#F9F9F9] rounded-md overflow-hidden flex items-center justify-center">
                                {item.imgThumbUrl ? (
                                    <img src={`http://localhost${item.imgThumbUrl}`} alt={item.name} className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-gray-300 text-sm">No Image</div>
                                )}
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{item.name}</h3>
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
                            <div className="text-[12px] text-gray-400 mb-1">
                                {item.reviewCount ?? 0} reviews
                            </div>
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
