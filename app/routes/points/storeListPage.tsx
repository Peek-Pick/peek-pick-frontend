import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PointStoreListDTO, PointStoreDTO } from "~/types/points/points";
import {listCoupon, readCoupon, redeemCoupon} from "~/api/points/pointsAPI";
import StoreListComponent from "~/components/points/storeListComponent";
import CouponModal from "~/routes/points/couponModal";

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

    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    //쿠폰 list 불러오기
    const { data, isLoading, isError } = useQuery<PageResponse<PointStoreListDTO>>({
        queryKey: ["points", page, size],
        queryFn: () => listCoupon(page, size, sort),
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
    );
}

export default StoreListPage;
