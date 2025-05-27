import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";              // ← 추가
import type { ProductListDTO } from "~/types/products";

interface Props {
    products: ProductListDTO[];
    // UseInfiniteQueryResult['fetchNextPage'] 와 똑같은 시그니처
    fetchNextPage: () => void | Promise<unknown>;
    hasNextPage: boolean | undefined;
    isFetchingNextPage: boolean;
}

export default function ListComponent({
                                          products,
                                          fetchNextPage,
                                          hasNextPage,
                                          isFetchingNextPage,
                                      }: Props) {
    const bottomRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();//상세 페이지에 필요함
    useEffect(() => {
        const el = bottomRef.current;
        if (!el) return;
        const observer = new IntersectionObserver((entries) => {
            if (
                entries[0].isIntersecting &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
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
        <div className="p-4 grid grid-cols-2 gap-4">
            {products.map((p) => (
                <div
                    key={p.barcode}
                    className="border rounded-lg overflow-hidden"
                    onClick={() => navigate(`/products/${p.barcode}`)}
                >
                    {p.img_url && (
                        <img
                            src={p.img_url}
                            alt={p.name}
                            className="w-full h-40 object-cover"
                        />
                    )}
                    <div className="p-2">
                        <h2 className="text-lg font-semibold">{p.name}</h2>
                        <p className="text-sm text-gray-600">
                            좋아요: {p.like_count}
                        </p>
                    </div>
                </div>
            ))}

            {hasNextPage && (
                <div ref={bottomRef} className="h-1 col-span-2" />
            )}

            {isFetchingNextPage && (
                <p className="col-span-2 text-center py-2 text-sm">
                    로딩 중…
                </p>
            )}

            {!hasNextPage && (
                <p className="col-span-2 text-center py-2 text-gray-400">
                    마지막 상품입니다.
                </p>
            )}
        </div>
    );
}
