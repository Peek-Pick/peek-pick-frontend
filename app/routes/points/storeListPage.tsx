import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listCoupon, redeemCoupon } from "~/api/points/pointsAPI";
import StoreListComponent from "~/components/points/storeListComponent";
import CouponModal from "~/routes/points/couponModal";
import type { PointStoreDTO, PointStoreListDTO } from "~/types/points";
import { PointProductType } from "~/enums/points/points";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStore } from "@fortawesome/free-solid-svg-icons";
import PaginationComponent from "~/components/common/PaginationComponent";
import type {PagingResponse} from "~/types/common";
import {readCoupon} from "~/api/points/adminPointsAPI";


function StoreListPage() {
    const [page, setPage] = useState(0); // 0-based
    const size = 10;
    const sort = "pointstoreId";
    
    const [filter, setFilter] = useState<keyof typeof PointProductType | "ALL">("ALL");

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 쿠폰 list 불러오기
    const { data, isLoading, isError } = useQuery<PagingResponse<PointStoreListDTO>>({
        queryKey: ["points", page, size, filter],
        queryFn: () => listCoupon(page, size, sort, filter),
        staleTime: 1000 * 60 * 5
    });

    // 쿠폰 상세정보 불러오기 - 모달에서 보여 줄 정보
    const { data: selectedProductDetail,} = useQuery<PointStoreDTO>({
        queryKey: ["pointDetail", selectedProductId],
        queryFn: () =>
            selectedProductId !== null ? readCoupon(selectedProductId) : Promise.reject(),
        enabled: selectedProductId !== null,
    });

    if (isLoading) return <div className="p-4 text-gray-600">Loading...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">An error occurred</div>;

    const handleBuy = async (product: PointStoreDTO) => {
        try {
            await redeemCoupon(product.pointstoreId);

            alert(`${product.item} purchase complete!`);
            setIsModalOpen(false);
            setSelectedProductId(null);
        } catch (e) {
            alert("Purchase failed");
        }
    };


    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
                <FontAwesomeIcon icon={faStore} /> Point Store
            </h3>

            {/*필터링버튼*/}
            <div className="border-b border-gray-300 mb-6 px-4 sm:px-0">
                <nav className="flex justify-center space-x-3 sm:space-x-6 overflow-x-auto no-scrollbar pl-5 sm:pl-8">
                    {(["ALL", "CU", "GS25", "SEVEN_ELEVEN", "EMART24", "OTHERS"] as (
                        | keyof typeof PointProductType
                        | "ALL"
                        )[]).map((type) => {
                        const labels = {
                            ALL: "ALL",
                            CU: "CU",
                            GS25: "GS25",
                            SEVEN_ELEVEN: "SEVEN-ELEVEN",
                            EMART24: "EMART24",
                            OTHERS: "OTHERS",
                        };
                        const isActive = filter === type;
                        return (
                            <button
                                key={type}
                                onClick={() => {
                                    setFilter(type);
                                    setPage(0);
                                }}
                                className={`relative pb-2 transition-colors duration-300 text-xs sm:text-sm whitespace-nowrap ${
                                    isActive
                                        ? "font-bold text-yellow-400 border-b-2 border-yellow-400"
                                        : "font-normal text-gray-500 hover:text-yellow-400"
                                }`}
                            >
                                {labels[type]}
                                {isActive && (
                                    <span className="absolute -bottom-0 left-0 right-0 h-0.5 bg-yellow-400"></span>
                                )}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div>
                <StoreListComponent
                    products={data.content}
                    onProductClick={(product) => {
                        setSelectedProductId(product.pointstoreId);
                        setIsModalOpen(true);
                    }}
                />

                {/* 페이지네이션 컴포넌트 */}
                <PaginationComponent
                    currentPage={data.number}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                    maxPageButtons={5}
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
