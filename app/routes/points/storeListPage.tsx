import {useEffect, useState} from "react";
import { useQuery } from "@tanstack/react-query";
import {listCoupon, readCoupon, redeemCoupon} from "~/api/points/pointsAPI";
import StoreListComponent from "~/components/points/storeListComponent";
import CouponModal from "~/components/points/couponModal";
import type { PointStoreDTO, PointStoreListDTO } from "~/types/points";
import { PointProductType } from "~/enums/points/points";
import PaginationComponent from "~/components/common/PaginationComponent";
import type {PagingResponse} from "~/types/common";
import {BackButton} from "~/util/button/FloatingActionButtons";
import { ShoppingBag} from "lucide-react";
import PointsLoading from "~/util/loading/pointsLoading";


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
        // staleTime: 1000 * 60 * 5
    });

    // 쿠폰 상세정보 불러오기 - 모달에서 보여 줄 정보
    const {
        data: selectedProductDetail,
        isLoading: detailIsLoading,
        isError: detailIsError
    } = useQuery<PointStoreDTO>({
        queryKey: ["pointDetail", selectedProductId],
        queryFn: () =>
            selectedProductId !== null ? readCoupon(selectedProductId) : Promise.reject(),
        enabled: selectedProductId !== null,
    });

    // 최소 1.6초 동안 로딩 스피너 표시
    const [fakeLoading, setFakeLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setFakeLoading(false), 1600);
        return () => clearTimeout(timer);
    }, []);

    // 로딩, 에러 처리
    if (isLoading || detailIsLoading || fakeLoading) return <PointsLoading />;
    if (isError || detailIsError || !data) return (
        <p className="text-center p-4 text-red-500 text-base sm:text-lg">
            Failed to load points data.
        </p>
    );

    const handleBuy = async (product: PointStoreDTO) => {
        try {
            await redeemCoupon(product.pointstoreId);

            setIsModalOpen(false);
            setSelectedProductId(null);

            return { success: true };
        } catch {
            return { success: false };
        }
    };


    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 pt-4 pb-6 relative space-y-4">
            <div className="flex justify-between items-center mb-4 mt-1.5">
                <h2 className="flex items-center gap-1 text-xl font-bold text-yellow-500 select-none leading-none">
                    <ShoppingBag className="w-6 h-6 leading-none ml-1.5" />
                    <span className="leading-none text-black ml-1.5">Point Store</span>
                </h2>
            </div>

            {/*필터링버튼*/}
            <div className="border-b border-gray-300 mb-6 px-4 sm:px-0">
                <nav className="flex justify-start sm:justify-center space-x-3 sm:space-x-6 overflow-x-auto no-scrollbar px-5 sm:px-0">
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
                                    <span className="absolute -bottom-0 left-0 right-0 h-0.5 bg-yellow-400 "></span>
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
            {/*<BottomNavComponent />*/}
            <BackButton />
        </div>
    );
}

export default StoreListPage;
