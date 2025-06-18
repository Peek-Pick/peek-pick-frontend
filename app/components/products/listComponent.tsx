// src/components/products/ListComponent.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import type { ProductListDTO } from "~/types/products";
import {
    ProductLoading,
    ProductInfiniteLoading,
} from "~/util/loading/productLoading";

interface Props {
    products: ProductListDTO[];
    fetchNextPage: () => void | Promise<unknown>;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    isLoading: boolean;
    isError: boolean;
    onItemClick: (barcode: string) => void;
    isRanking?: boolean;
}

export default function ListComponent({
                                          products,
                                          fetchNextPage,
                                          hasNextPage,
                                          isFetchingNextPage,
                                          isLoading,
                                          isError,
                                          onItemClick,
                                          isRanking = false,
                                      }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // isRanking이면 최대 100개까지만 표시, 아니면 전체
    const limitedProducts = isRanking ? products.slice(0, 100) : products;

    useEffect(() => {
        const el = bottomRef.current;
        if (!el) return;

        const observer = new IntersectionObserver((entries) => {
            const canFetchMore = isRanking
                ? limitedProducts.length < 100
                : true;

            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage && canFetchMore) {
                fetchNextPage();
            }
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage, limitedProducts.length, isRanking]);

    if (isLoading) {
        return <ProductLoading />;
    }

    if (isError) {
        return (
            <p className="p-4 text-center text-red-500 text-base sm:text-lg">
                상품 정보를 불러오지 못했습니다.
            </p>
        );
    }

    if (limitedProducts.length === 0) {
        return (
            <p className="p-4 text-center text-gray-500">
                상품이 없습니다.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {limitedProducts.map((p, idx) => (
                <div
                    key={`${p.barcode}-${idx}`}
                    className="relative p-[16px] bg-white border border-[#FBFBFB]
                        shadow-[0px_5px_22px_rgba(0,0,0,0.04)] rounded-[16px]
                        transition-shadow duration-300 hover:shadow-[0px_21px_44px_rgba(0,0,0,0.08)]
                        cursor-pointer"
                    onClick={() => onItemClick(p.barcode)}
                >
                    {/* 🔢 순위 배지 */}
                    {isRanking && p.rank && (
                        <div className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full bg-[#ff5e5e] text-white text-xs font-bold z-10">
                            {p.rank}
                        </div>
                    )}

                    <figure className="bg-[#F9F9F9] rounded-[12px] p-2 mb-4 overflow-hidden">
                        <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                            {p.imgUrl && (
                                <img
                                    src={p.imgUrl}
                                    alt={p.name}
                                    className="absolute top-0 left-0 w-full h-full object-contain object-center"
                                />
                            )}
                        </div>
                    </figure>

                    <h3 className="text-[14px] leading-[25px] font-semibold text-[#333] mb-1">
                        {p.name}
                    </h3>

                    <div className="flex items-center text-[13px] text-[#222] mb-1 space-x-4">
                        <span className="flex items-center">
                            <Icon icon="ri:heart-fill" className="w-4 h-4 text-red-500 mr-1" />
                            {p.likeCount ?? 0}
                        </span>
                        <span className="flex items-center">
                            <Icon icon="ri:star-fill" className="w-4 h-4 text-[#FFC43F] mr-1" />
                            {p.score?.toFixed(1) ?? "0.0"} ({p.reviewCount ?? 0})
                        </span>
                    </div>

                    {p.category && (
                        <span className="text-[13px] text-[#9D9D9D] uppercase">
                            {p.category}
                        </span>
                    )}
                </div>
            ))}

            {/* 더 불러올 수 있는 경우에만 bottomRef 활성화 */}
            {hasNextPage && (
                <div ref={bottomRef} className="col-span-full h-1" />
            )}

            {/* 랭킹일 경우에만 제한 메시지 출력 */}
            {isRanking && limitedProducts.length >= 100 && (
                <p className="col-span-full text-center py-2 text-sm text-gray-400">
                    마지막 상품입니다.
                </p>
            )}

            {isFetchingNextPage && (
                <div className="col-span-full flex justify-center">
                    <ProductInfiniteLoading />
                </div>
            )}
        </div>
    );
}
