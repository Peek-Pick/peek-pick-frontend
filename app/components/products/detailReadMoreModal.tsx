
import type { ProductDetailDTO } from "~/types/products";

interface Props {
    product?: ProductDetailDTO;
    onClose: () => void;
}

export default function DetailReadMoreModal({ product, onClose }: Props) {
    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center ">
            <div className="flex flex-col bg-white rounded-2xl py-4 px-3 h-[500px] overflow-y-auto mx-8">
                {/* 헤더: 고정 */}
                <div className="p-4 border-b flex justify-between items-center">
                    <h4 className="text-base font-bold">{product.name}</h4>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">✕</button>
                </div>

                {/* 본문: 스크롤 영역 */}
                <div className="flex-grow overflow-y-auto px-3 py-4">
                    <div className="block mb-4">
                        <h3 className="text-gray-900 font-semibold mb-2">Product Info</h3>
                        <p className="text-gray-600 text-sm">{product.description ?? "-"}</p>
                    </div>

                    <div className="block mb-4">
                        <h3 className="text-sm text-gray-900 font-semibold mb-2">Category</h3>
                        <p className="text-gray-600 text-sm">{product.category ?? "-"}</p>
                    </div>

                    <div className="block mb-4">
                        <h3 className="text-sm text-gray-900 font-semibold mb-2">용량</h3>
                        <p className="text-gray-600 text-sm">{product.volume ?? "-"}</p>
                    </div>

                    <div className="block mb-4">
                        <h3 className="text-sm text-gray-900 font-semibold mb-2">원재료</h3>
                        <p className="text-gray-600 text-sm">{product.ingredients ?? "-"}</p>
                    </div>

                    <div className="block mb-4">
                        <h3 className="text-sm text-gray-900 font-semibold mb-2">알레르기 정보</h3>
                        <p className="text-gray-600 text-sm">{product.allergens ?? "-"}</p>
                    </div>

                    <div className="block mb-4">
                        <h3 className="text-sm text-gray-900 font-semibold mb-2">영양 성분</h3>
                        <p className="text-gray-600 text-sm">{product.nutrition ?? "-"}</p>
                    </div>
                </div>

                {/* 푸터: 고정 */}
                <div className="p-4 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className=" flex items-center gap-1 px-2 py-1 rounded-full border font-medium text-xs sm:text-xs bg-gray-100 text-gray-500 border-gray-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}