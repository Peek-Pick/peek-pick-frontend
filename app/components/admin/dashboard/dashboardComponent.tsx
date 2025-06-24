import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import StatsCardComponent from "~/components/admin/dashboard/statsCardComponent";
import PeriodDropdownComponent from "~/components/admin/dashboard/periodDropdownComponent";
import LogComponent from "~/components/admin/dashboard/logComponent";
import {
    type Category, getAdminDashboardChartNationality,
    getAdminDashboardChartReview, getAdminDashboardChartUser,
    getAdminDashboardInquiryList,
    getAdminDashboardReportList, getAdminDashboardStatus
} from "~/api/dashboardAPI";
import TrendChartComponent from "~/components/admin/dashboard/TrendChartComponent";
import type { PagingResponse } from "~/types/common";
import PaginationComponent from "~/components/common/PaginationComponent";

export default function DashboardComponent() {
    const [period, setPeriod] = useState("This Month");

    // 페이지 상태 관리
    const [page, setPage] = useState(0);

    // 페이지네이션 핸들러
    const handlePage = (page: number) => {
        setPage(page);
    };

    // 요청사항 필터 상태
    const [category, setCategory] = useState<Category>("문의");

    // 통계 토글 상태
    const [selectedTab, setSelectedTab] = useState<"리뷰 추이" | "회원 추이" | "국적 분포">("국적 분포");

    // 요청사항 리스트 -  타입 유추
    const { data: requestData, isLoading: requestLoading, isError: requestError } = useQuery<PagingResponse<AdminDashInquiryDTO | AdminDashReportDTO>>({
        queryKey: ["adminDashRequestList", page, category],
        queryFn: () => {
            if (category === "문의") {
                return getAdminDashboardInquiryList(page);
            } else {
                return getAdminDashboardReportList(page);
            }
        },
        staleTime: 1000 * 60 * 5,
        enabled: !!category,
    });

    // 통계 데이터 - 리뷰
    const { data: rawReviewData } = useQuery<AdminDashChart[]>({
        queryKey: ["adminDashChartReview"],
        queryFn: () => getAdminDashboardChartReview(),
        staleTime: 1000 * 60 * 5,
    });

    // 통계 데이터 - 사용자
    const { data: rawUserData } = useQuery<AdminDashChart[]>({
        queryKey: ["adminDashChartUser"],
        queryFn: () => getAdminDashboardChartUser(),
        staleTime: 1000 * 60 * 5,
    });

    // 통계 데이터 - 국적
    const { data: rawNationalityData } = useQuery<AdminDashChart[]>({
        queryKey: ["adminDashChartNationality"],
        queryFn: () => getAdminDashboardChartNationality(),
        staleTime: 1000 * 60 * 5,
    });

    // 이번달 데이터, 증가율 - 상품, 사용자, 리뷰
    const { data: statusData } = useQuery<[number[], number[]]>({
        queryKey: ["adminDashStatusData"],
        queryFn: () => getAdminDashboardStatus(),
        staleTime: 1000 * 60 * 5,
    });

    // 이번달 데이터 - 상품, 사용자, 리뷰
    const values = statusData ? statusData[0] : [];

    // 저번달 대비 증가율 - 상품, 사용자, 리뷰
    const percents = statusData ? statusData[1] : [];

    // 이번달 목표값 - 상품, 사용자, 리뷰
    const goals = [1000, 5000, 10000];

    return (
        <div className="container mx-auto p-2">
            {/* 드롭다운 */}
            <div className="flex justify-between items-center mb-2">
                <PeriodDropdownComponent period={period} setPeriod={setPeriod} />
            </div>

            {/* 통계 카드 */}
            <div className="grid gap-6">
                <StatsCardComponent values={values} goals={goals} percents={percents}/>
            </div>

            {/* 요청사항 - 문의, 신고 + 그래프  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 왼쪽: 요청사항 로그 */}
                <div className="bg-light min-h-screen">
                    <div className="container py-5">
                        <div className="flex justify-center">
                            <div className="w-full max-w-6xl">
                                <div className="bg-white shadow-sm rounded-lg border-0 py-2">
                                    <LogComponent data={requestData} isLoading={requestLoading} isError={requestError}
                                                  category={category} setCategory={setCategory} setPage={setPage}
                                    />

                                    {/* 페이지네이션 컴포넌트 추가 */}
                                        <PaginationComponent
                                            currentPage={page}
                                            totalPages={requestData?.totalPages}
                                            onPageChange={handlePage}
                                            maxPageButtons={10}
                                        />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 통계 그래프 */}
                <div className="bg-light min-h-screen">
                    <div className="container py-5">
                        <div className="flex justify-center">
                            <div className="w-full max-w-6xl">
                                <div className="bg-white shadow-sm rounded-lg border-0 py-2">
                                    <TrendChartComponent selectedTab={selectedTab} setSelectedTab={setSelectedTab}
                                                         rawReviewData={rawReviewData} rawUserData={rawUserData}
                                                         rawNationalityData={rawNationalityData}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}