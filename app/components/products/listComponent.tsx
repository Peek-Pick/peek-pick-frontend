import type { ProductListDTO } from "~/types/products";

interface Props {
    products: ProductListDTO[];
    page: number;
    size: number;
    totalElements: number;
    setPage: (page: number) => void;
}

export default function ListComponent({
                                          products,
                                          page,
                                          size,
                                          totalElements,
                                          setPage,
                                      }: Props) {
    const totalPages = Math.ceil(totalElements / size);

    const onPrev = () => page > 0 && setPage(page - 1);
    const onNext = () => page < totalPages - 1 && setPage(page + 1);

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                {products.map((p) => (
                    <div key={p.product_id} className="border p-4 rounded-lg">
                        {p.img_url && (
                            <img
                                src={p.img_url}
                                alt={p.name}
                                className="w-full h-40 object-cover mb-2"
                            />
                        )}
                        <h2 className="text-lg font-semibold">{p.name}</h2>
                        <p>좋아요: {p.like_count ?? 0}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 flex justify-center space-x-4">
                <button
                    onClick={onPrev}
                    disabled={page === 0}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    이전
                </button>
                <button
                    onClick={onNext}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 border rounded disabled:opacity-50"
                >
                    다음
                </button>
            </div>
        </>
    );
}
