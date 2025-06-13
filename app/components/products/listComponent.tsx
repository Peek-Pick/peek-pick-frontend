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
}

export default function ListComponent({
                                          products,
                                          fetchNextPage,
                                          hasNextPage,
                                          isFetchingNextPage,
                                          isLoading,
                                          isError,
                                      }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const el = bottomRef.current;
        if (!el) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    // 1) 초기 로딩
    if (isLoading) {
        return <ProductLoading />;
    }
    // 2) 에러
    if (isError) {
        return (
            <p className="p-4 text-center text-red-500 text-base sm:text-lg">
                상품 정보를 불러오지 못했습니다.
            </p>
        );
    }
    // 3) 빈 목록
    if (products.length === 0) {
        return (
            <p className="p-4 text-center text-gray-500">
                상품이 없습니다.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.map((p, idx) => (
                <div
                    key={`${p.barcode}-${idx}`}
                    className="
                        p-[16px] bg-white border border-[#FBFBFB]
                        shadow-[0px_5px_22px_rgba(0,0,0,0.04)] rounded-[16px]
                        transition-shadow duration-300 hover:shadow-[0px_21px_44px_rgba(0,0,0,0.08)]
                        cursor-pointer
                    "
                    onClick={() => navigate(`/products/${p.barcode}`)}
                >
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
                            <Icon
                                icon="ri:star-fill"
                                className="w-4 h-4 text-[#FFC43F] mr-1"
                            />
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

            {hasNextPage && <div ref={bottomRef} className="col-span-full h-1" />}

            {!hasNextPage && (
                <p className="col-span-full text-center py-2 text-sm text-gray-400">
                    마지막 상품입니다.
                </p>
            )}

            {/* 무한 스크롤 추가 로딩 */}
            {isFetchingNextPage &&
                <div className="col-span-full flex justify-center">
                    <ProductInfiniteLoading />
                </div>
            }
        </div>
    );
}
