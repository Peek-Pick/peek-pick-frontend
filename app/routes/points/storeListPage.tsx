import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {listCoupon, readCoupon, redeemCoupon} from "~/api/points/pointsAPI";
import StoreListComponent from "~/components/points/storeListComponent";
import CouponModal from "~/routes/points/couponModal";
import type {PointStoreDTO, PointStoreListDTO} from "~/types/points";
import {type CouponStatus, PointProductType} from "~/enums/points/points";

interface PageResponse<T> {
    content: T[];
    total_elements: number;
    total_pages: number;
    size: number;
    number: number;
}

function StoreListPage() {
    const [page, setPage] = useState(0); // 0-based
    const size = 10;
    const sort = "pointstoreId";
    const [filter, setFilter] = useState<keyof typeof PointProductType | "ALL">("ALL");

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //쿠폰 list 불러오기
    const { data, isLoading, isError } = useQuery<PageResponse<PointStoreListDTO>>({
        queryKey: ["points", page, size, filter],
        queryFn: () => listCoupon(page, size, sort, filter),
    });

    //쿠폰 상세정보 불러오기 - 모달에서 보여 줄 정보
    const {data: selectedProductDetail, isLoading: isDetailLoading, isError: isDetailError,} = useQuery<PointStoreDTO>({
        queryKey: ["pointDetail", selectedProductId],
        queryFn: () => selectedProductId !== null ? readCoupon(selectedProductId) : Promise.reject(),
        enabled: selectedProductId !== null,
    });

    if (isLoading) return <div className="p-4 text-gray-600">불러오는 중...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;

    const handleBuy = async (product: PointStoreDTO) => {
        try {
            await redeemCoupon(product.pointstoreId);

            alert(`${product.item} 구매 완료!`);
            setIsModalOpen(false);
            setSelectedProductId(null);
        } catch (e) {
            alert("구매 실패");
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                🛒 포인트 상점
            </h2>
            {/*필터링버튼*/}
            <div className="flex justify-center gap-4 mb-6">
                {(["ALL", "CU", "GS25", "SEVEN_ELEVEN", "EMART24", "OTHERS"] as (keyof typeof PointProductType | "ALL")[]).map(
                    (type) => {
                        const labels = {
                            ALL: "전체",
                            CU: "CU",
                            GS25: "GS25",
                            SEVEN_ELEVEN: "세븐일레븐",
                            EMART24: "이마트24",
                            OTHERS: "기타",
                        };
                        const isActive = filter === type;
                        return (
                            <button
                                key={type}
                                onClick={() => {
                                    setFilter(type);
                                    setPage(0);
                                }}
                                className={`px-5 py-2 font-semibold rounded-full transition-colors duration-300 
            ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {labels[type]}
                            </button>
                        );
                    }
                )}
            </div>

        <div>
            <StoreListComponent
                products={data.content}
                page={data.number}
                setPage={setPage}
                size={data.size}
                totalElements={data.total_elements}
                onProductClick={(product) => {
                    setSelectedProductId(product.pointstoreId);
                    setIsModalOpen(true);
                }}
            />
            {/*쿠폰 구매 모달 - 상품 클릭시 불러옴*/}
            {isModalOpen && selectedProductDetail && (
                <CouponModal
                    product={selectedProductDetail}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedProductId(null);
                    }}
                    onBuy={handleBuy}
                />
            )}

        </div>
        </div>
    );
}

export default StoreListPage;