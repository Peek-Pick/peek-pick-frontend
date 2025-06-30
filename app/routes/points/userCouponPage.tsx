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
import PointsLoading from "~/util/loading/pointsLoading";
import {ErrorComponent} from "~/util/loading/errorComponent";
import {BackButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";


function UserCouponPage() {
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState<keyof typeof CouponStatus | "ALL">("ALL");
    const size = 10;
    const sort = "couponId,desc";

    const { data, isLoading, isError } = useQuery<PagingResponse<UserCouponDTO>>({
        queryKey: ["coupons", page, size, sort, filter],
        queryFn: () => userCouponList(page, size, sort, filter),
    });

    // 로딩, 에러 처리
    if (isLoading) return <PointsLoading />;
    if (isError || !data) return "Error";

    return (
        <>
            <UserCouponComponent
                coupons={data.content}
                header={(
                    <>
                        <h2 className="flex items-center gap-1 text-xl font-bold text-yellow-500 select-none leading-none pb-5">
                            <FontAwesomeIcon icon={faTicket} />
                            <span className="leading-none text-black ml-1.5">My Coupons</span>
                        </h2>

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

            {/*<BottomNavComponent />*/}
            <BackButton />

            <FloatingActionButtons />
        </>
    );
}

export default UserCouponPage;
