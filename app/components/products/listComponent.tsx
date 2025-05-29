// src/components/products/ListComponent.tsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import type { ProductListDTO } from "~/types/products";

interface Props {
    products: ProductListDTO[];
    fetchNextPage: () => void | Promise<unknown>;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
}

export default function ListComponent({
                                          products,
                                          fetchNextPage,
                                          hasNextPage,
                                          isFetchingNextPage,
                                      }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // 무한 스크롤 옵저버 등록
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

    if (products.length === 0) {
        return (
            <p className="p-4 text-center text-gray-500">
                상품이 없습니다.
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.map((p, idx) => (
                <div
                    key={`${p.barcode}-${idx}`}  // barcode + index 조합으로 고유 key 부여
                    className="
            p-[16px] bg-white border border-[#FBFBFB]
            shadow-[0px_5px_22px_rgba(0,0,0,0.04)] rounded-[16px]
            transition-shadow duration-300 hover:shadow-[0px_21px_44px_rgba(0,0,0,0.08)]
            cursor-pointer
          "
                    onClick={() => navigate(`/products/${p.barcode}`)}
                >
                    {/* 1. 이미지 */}
                    <figure className="bg-[#F9F9F9] rounded-[12px] p-2 mb-4 text-center">
                        {p.img_url && (
                            <img
                                src={p.img_url}
                                alt={p.name}
                                className="max-h-[210px] h-auto mx-auto"
                            />
                        )}
                    </figure>

                    {/* 2. 상품명 */}
                    <h3 className="text-[18px] leading-[25px] font-semibold text-[#333] mb-1">
                        {p.name}
                    </h3>

                    {/* 3. 좋아요 · 별점(리뷰 수) */}
                    <div className="flex items-center text-[13px] text-[#222] mb-1 space-x-4">
            <span className="flex items-center">
              <Icon
                  icon="ri:heart-fill"
                  className="w-4 h-4 text-red-500 mr-1"
              />
                {p.like_count ?? 0}
            </span>
                        <span className="flex items-center">
              <Icon
                  icon="ri:star-fill"
                  className="w-4 h-4 text-[#FFC43F] mr-1"
              />
                            {p.score?.toFixed(1) ?? "0.0"} ({p.review_count ?? 0})
            </span>
                    </div>

                    {/* 4. 카테고리 */}
                    {p.category && (
                        <span className="text-[13px] text-[#9D9D9D] uppercase">
              {p.category}
            </span>
                    )}
                </div>
            ))}

            {/* 무한 스크롤 트리거 엘리먼트 */}
            {hasNextPage && <div ref={bottomRef} className="col-span-full h-1" />}
            {isFetchingNextPage && (
                <p className="col-span-full text-center py-2 text-sm">
                    로딩 중…
                </p>
            )}
            {!hasNextPage && (
                <p className="col-span-full text-center py-2 text-sm text-gray-400">
                    마지막 상품입니다.
                </p>
            )}
        </div>
    );
}
