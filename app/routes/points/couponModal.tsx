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
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{product.item}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <img
                    src={`http://localhost:8080/uploads/${product.imgUrl}`}
                    alt={product.item}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                />

                <p className="text-gray-700 mb-2">가격: <span className="font-semibold">{product.price} 포인트</span></p>
                <p className="text-gray-500 text-sm mb-6">{product.productType}</p>
                <p className="text-gray-500 text-sm mb-6">상세정보: {product.description}</p>

                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => onBuy(product)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        구매
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}