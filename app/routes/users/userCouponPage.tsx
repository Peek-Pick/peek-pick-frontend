import { useState } from "react";
import UserCouponComponent from "~/components/users/userCouponComponent";
import { useQuery } from "@tanstack/react-query";
import { userCouponList } from "~/api/points/pointsAPI";
import type {UserCouponDTO} from "~/types/points";
import type {CouponStatus} from "~/enums/points/points";

interface PageResponse<T> {
    content: T[];
    total_elements: number;
    total_pages: number;
    number: number;
    pageable: {
        page_size: number;
        page_number: number;
    };
}

function UserCouponPage() {
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState<keyof typeof CouponStatus | "ALL">("ALL");
    const size = 10;
    const sort = "couponId";

    const { data, isLoading, isError } = useQuery<PageResponse<UserCouponDTO>>({
        queryKey: ["coupons", page, size, sort, filter],
        queryFn: () => userCouponList(page, size, sort, filter),
    });

    if (isLoading) return <div>불러오는 중...</div>;
    if (isError || !data) return <div>에러 발생</div>;

    return (
        <>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                🎟️ 내 쿠폰함
            </h2>
            {/*필터링버튼*/}
            <div className="flex justify-center gap-4 mb-6">
                {(["ALL", "AVAILABLE", "USED", "EXPIRED"] as (keyof typeof CouponStatus | "ALL")[]).map(
                    (status) => {
                        const labels = {
                            ALL: "전체",
                            AVAILABLE: "보유 쿠폰",
                            USED: "사용완료 쿠폰",
                            EXPIRED: "기간만료 쿠폰",
                        };
                        const isActive = filter === status;
                        return (
                            <button
                                key={status}
                                onClick={() => {
                                    setFilter(status);
                                    setPage(0);
                                }}
                                className={`px-5 py-2 font-semibold rounded-full transition-colors duration-300 
            ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {labels[status]}
                            </button>
                        );
                    }
                )}
            </div>

            <UserCouponComponent
                coupons={data.content}
                page={data.number}
                setPage={setPage}
                size={data.pageable.page_size}
                totalElements={data.total_elements}
            />
            </div>
        </>
    );
}


export default UserCouponPage;