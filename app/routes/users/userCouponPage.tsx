import { useState } from "react";
import UserCouponComponent from "~/components/users/userCouponComponent";
import { useQuery } from "@tanstack/react-query";
import { userCouponList } from "~/api/points/pointsAPI";
import type { UserCouponDTO } from "~/types/points";
import type { CouponStatus } from "~/enums/points/points";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket } from '@fortawesome/free-solid-svg-icons';

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

    if (isLoading) return <div>Loading...</div>;
    if (isError || !data) return <div>An error occurred.</div>;

    return (
        <UserCouponComponent
            coupons={data.content}
            page={data.number}
            setPage={setPage}
            size={data.pageable.page_size}
            totalElements={data.total_elements}
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
    );
}

export default UserCouponPage;
