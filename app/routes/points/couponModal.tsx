import type {PointStoreDTO} from "~/types/points";
import Swal from "sweetalert2";
import {useNavigate} from "react-router-dom";


interface Props {
    product: PointStoreDTO;
    onClose: () => void;
    onBuy: (product: PointStoreDTO) => Promise<{ success: boolean }>;
}

//쿠폰 구매 모달
export default function CouponModal({ product, onClose, onBuy }: Props) {

    console.log(product);

    const navigate = useNavigate();

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-[280px] p-4 animate-fade-in overflow-auto max-h-[60vh] text-sm sm:max-w-md sm:max-h-[80vh] sm:p-5 sm:text-base">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg sm:text-xl font-semibold truncate">{product.item}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition text-base sm:text-lg"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {/* 이미지 */}
                <img
                    src={`http://localhost:8080/points/${product.imgUrl}`}
                    alt={product.item}
                    className="w-full h-36 sm:h-44 object-cover rounded-lg mb-3"
                />

                {/* 정보 박스 */}
                <div className="bg-gray-50 rounded-xl p-4 shadow-inner border border-gray-200 space-y-3">
                    <div className="flex items-center gap-2">
                        <p className="text-gray-700 font-bold text-lg">{product.price.toLocaleString()} Points</p>
                        <span className="inline-block bg-yellow-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full tracking-wide whitespace-nowrap select-none">
                          {product.productType}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</h3>
                        <p className="text-gray-700 whitespace-pre-line leading-snug text-sm">{product.description}</p>
                    </div>
                </div>

                {/* 버튼 */}
                <div className="flex justify-end space-x-2 text-sm sm:text-base mt-4">
                    <button
                        onClick={async () => {
                            try {
                                Swal.fire({
                                    title: "Processing purchase...",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    didOpen: () => {
                                        Swal.showLoading();
                                    },
                                    customClass: {
                                        popup: 'custom-popup',
                                        title: 'custom-title',
                                        actions: 'custom-actions',
                                        confirmButton: 'custom-confirm-button',
                                    }
                                });

                                const result = await onBuy(product);

                                if (result.success) {
                                    await Swal.fire({
                                        title: "Purchase completed",
                                        icon: "success",
                                        confirmButtonText: "OK",
                                        customClass: {
                                            popup: 'custom-popup',
                                            title: 'custom-title',
                                            actions: 'custom-actions',
                                            confirmButton: 'custom-confirm-button',
                                        }
                                    }).then(() => {
                                        onClose();
                                        navigate(`/points/store/list`);
                                    });
                                } else {
                                    await Swal.fire({
                                        title: "Purchase failed",
                                        html: `<p style="font-size: 0.9rem; color: #f43f5e; margin-top: 8px;">Insufficient balance.</p>`,
                                        icon: "error",
                                        confirmButtonText: "OK",
                                        customClass: {
                                            popup: "custom-popup",
                                            title: "custom-title",
                                            actions: "custom-actions",
                                            confirmButton: "custom-confirm-button",
                                        },
                                    });
                                }
                            } catch {
                                await Swal.fire({
                                    title: "Error",
                                    icon: "warning",
                                    confirmButtonText: "OK",
                                    customClass: {
                                        popup: "custom-popup",
                                        title: "custom-title",
                                        actions: "custom-actions",
                                        confirmButton: "custom-confirm-button",
                                    },
                                });
                            }
                        }}
                        className="flex items-center gap-1 rounded-md border border-blue-600 bg-white px-3 py-1 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-100 hover:text-blue-800 transition"
                    >
                        Buy
                    </button>
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 transition"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}