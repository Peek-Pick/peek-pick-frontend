import { useState } from "react";
import StatsCardComponent from "~/components/admin/dashboard/statsCardComponent";
import PeriodDropdownComponent from "~/components/admin/dashboard/periodDropdownComponent";
import LogComponent from "~/components/admin/dashboard/logComponent";

import {faShoppingCart, faUsers, faStar, faDollarSign,} from "@fortawesome/free-solid-svg-icons";
import {useQuery} from "@tanstack/react-query";
import type {PagingResponse} from "~/types/common";
import {getAdminReviewList} from "~/api/reviews/adminReviewAPI";

// 요청사항 필터 타입
type Category = "전체" | "신고" | "문의";

export default function DashboardComponent() {
    const [period, setPeriod] = useState("This Month");

    const stats = [
        {
            id: 1,
            title: "총 상품 수",
            value: "24,589",
            icon: faShoppingCart,
            iconBg: "bg-blue-100 text-blue-600",
            trend: { up: true, percent: "12.5%" },
            progress: "w-3/4",
            progressColor: "bg-blue-600",
        },
        {
            id: 2,
            title: "사용자 수",
            value: "14,789",
            icon: faUsers,
            iconBg: "bg-green-100 text-green-600",
            trend: { up: false, percent: "5.2%" },
            progress: "w-2/3",
            progressColor: "bg-green-600",
        },
        {
            id: 3,
            title: "리뷰 수",
            value: "1,589",
            icon: faStar,
            iconBg: "bg-yellow-100 text-yellow-600",
            trend: { up: true, percent: "8.4%" },
            progress: "w-5/6",
            progressColor: "bg-yellow-600",
        },
        {
            id: 4,
            title: "Revenue",
            value: "$45,289",
            icon: faDollarSign,
            iconBg: "bg-cyan-100 text-cyan-600",
            trend: { up: true, percent: "15.7%" },
            progress: "w-9/10",
            progressColor: "bg-cyan-600",
        },
    ];

    const [filter, setFilter] = useState<Category>("전체");

    // 요청사항 리스트
    const { data, isLoading, isError } = useQuery<PagingResponse<AdminReviewSimpleDTO>>({
        queryKey: ["adminRequestList", 0, filter],
        queryFn: () => getAdminRequestList(0, filter),
        staleTime: 1000 * 60 * 5,
    });

    return (
        <div className="container mx-auto p-4">
            {/* 드롭다운 */}
            <div className="flex justify-between items-center mb-4">
                <PeriodDropdownComponent period={period} setPeriod={setPeriod} />
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((s) => (
                    <StatsCardComponent key={s.id} {...s} />
                ))}
            </div>

            {/* 요청사항 - 문의, 신고 */}
            <LogComponent />

            <div>사용자 관련 통계 - !활성 사용자 수</div>
            <div>상품 관련 통계 - !등록된 전체 상품 수 , !인기상품(별점 높은 상품)</div>
            <div>리뷰 관련 통계 - !리뷰 작성 수 추이(일별, 주별, 월별), 리뷰별 태그 빈도(맛, 등등..)</div>
            <div>신고 및 문의 현황 - !신고 접수 건수 및 처리 현황(시간별, 종류별)</div>
            <div>위치 기반 서비스 관련 통계 - 위치 기반 편의점 안내 사용 횟수, 사용자 위치 분포(지역별 사용자 수)</div>


        </div>
    );
}
