import { useState } from "react";
import UserCouponComponent from "~/components/points/userCouponComponent";
import { useQuery } from "@tanstack/react-query";
import { userCouponList } from "~/api/points/pointsAPI";
import type { UserCouponDTO } from "~/types/points";
import type { CouponStatus } from "~/enums/points/points";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';
import type {PagingResponse} from "~/types/common";
import PaginationComponent from "~/components/common/PaginationComponent";


function UserCouponPage() {
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState<keyof typeof CouponStatus | "ALL">("ALL");
    const size = 10;
    const sort = "couponId,desc";

    const { data, isLoading, isError } = useQuery<PagingResponse<UserCouponDTO>>({
        queryKey: ["coupons", page, size, sort, filter],
        queryFn: () => userCouponList(page, size, sort, filter),
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>An error occurred.</div>;

    return (
        <>
            <UserCouponComponent
                coupons={data.content}
                header={(
                    <>
                        <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
                            <FontAwesomeIcon icon={faTicket} /> My Coupons
                        </h3>

                        <div className="flex justify-center gap-2 flex-wrap">
                            {(["ALL", "AVAILABLE", "USED", "EXPIRED"] as (keyof typeof CouponStatus | "ALL")[]).map((status) => {
                                const labels = {
                                    ALL: "All",
                                    AVAILABLE: "Available",
                                    USED: "Used",
                                    EXPIRED: "Expired",
                                };
                                const isActive = filter === status;

                                return (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setFilter(status);
                                            setPage(0);
                                        }}
                                        className={`flex items-center gap-1 rounded-md px-4 py-1 text-sm font-medium transition
                                    ${
                                            isActive
                                                ? "bg-yellow-100 text-yellow-700 border border-yellow-300 hover:bg-yellow-200"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        {labels[status]}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            />

            {/* 페이지네이션 컴포넌트 */}
            <PaginationComponent
                currentPage={data.number}
                totalPages={data.totalPages}
                onPageChange={setPage}
                maxPageButtons={5}
            />
        </>
    );
}

export default UserCouponPage;
