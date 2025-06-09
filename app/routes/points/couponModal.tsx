import type {PointStoreDTO} from "~/types/points";


interface Props {
    product: PointStoreDTO;
    onClose: () => void;
    onBuy: (product: PointStoreDTO) => void;
}

//쿠폰 구매 모달
export default function CouponModal({ product, onClose, onBuy }: Props) {

    console.log(product);

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md p-3 sm:p-5 animate-fade-in overflow-auto max-h-[80vh] text-sm sm:text-base">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg sm:text-xl font-semibold">{product.item}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition text-base sm:text-lg"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <img
                    src={`http://localhost:8080/uploads/${product.imgUrl}`}
                    alt={product.item}
                    className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                />

                <div className="space-y-4">
                    {[
                        { label: "Price", value: `${product.price.toLocaleString()} Points` },
                        { label: "Type", value: product.productType },
                        { label: "Description", value: product.description, isDescription: true },
                    ].map(({ label, value, isDescription }, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-lg p-3 shadow-sm border border-gray-100"
                            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
                        >
                            <h3 className="text-xs font-semibold text-gray-400 mb-1 tracking-wide">
                                {label}
                            </h3>
                            <p
                                className={`text-gray-900 ${isDescription ? "whitespace-pre-line leading-relaxed" : "font-medium"}`}
                                style={{ fontSize: isDescription ? "0.9rem" : "1rem" }}
                            >
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end space-x-2 text-sm sm:text-base mt-3">
                    <button
                        onClick={() => onBuy(product)}
                        className="flex items-center gap-1 rounded-md border border-blue-600 bg-white px-4 py-1 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-100 hover:text-blue-800 transition"
                    >
                        Buy
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
