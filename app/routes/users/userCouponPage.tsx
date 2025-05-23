import { useState } from "react";
import UserCouponComponent from "~/components/users/userCouponComponent";
import type { UserCouponDTO } from "~/types/points/points";
import { useQuery } from "@tanstack/react-query";
import { userCouponList } from "~/api/points/pointsAPI";

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
    const [page, setPage] = useState(0); // 0-based
    const size = 10;
    const sort = "couponId";

    const { data, isLoading, isError } = useQuery<PageResponse<UserCouponDTO>>({
        queryKey: ["coupons", page, size, sort],
        queryFn: () => userCouponList(page, size, sort),
    });

    if (isLoading) return <div className="p-4 text-gray-600">불러오는 중...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;

    console.log("쿠폰 데이터", data);

    return (
        <UserCouponComponent
            coupons={data.content}
            page={data.number}
            setPage={setPage}
            size={data.pageable.page_size}
            totalElements={data.total_elements}
        />
    );
}

export default UserCouponPage;
