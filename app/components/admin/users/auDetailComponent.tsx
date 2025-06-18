import AuDetailHeaderComponent from "./auDetailHeaderComponent";
import type {UsersDetailDTO} from "~/types/users";
import AuDetailProfileComponent from "~/components/admin/users/auDetailProfileComponent";
import AuDetailReviewsComponent from "~/components/admin/users/auDetailReveiwsComponent";
import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import type {AxiosResponse} from "axios";
import type {PagingResponse} from "~/types/common";
import PaginationComponent from "~/components/common/PaginationComponent";
import {getAdminUserReviews, getAdminUserReviewsCount} from "~/api/users/adminUsersAPI";
import {useNavigate, useLocation, useSearchParams} from "react-router";
import LoadingComponent from "~/components/common/loadingComponent";

interface UsersDetailProps {
    users: UsersDetailDTO;
    userId: number;
    isLoading?: boolean;
    isError?: boolean;
}

function AuDetailComponent({users, userId, isLoading, isError}: UsersDetailProps) {

    const navigate = useNavigate();

    // 현재 URL 정보 - 페이지, 필터링
    const location = useLocation();

    // 이전 화면 (reviewList 또는 reportList)
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from") || "userList";

    // 목록으로 버튼 경로 설정
    const backToListPath = `/admin/users/list${location.search}`;

    //유저 리뷰 개수 받아오기
    const { data: reviewCount } = useQuery({
        queryKey: ["adminUserReviewCount"],
        queryFn: () => getAdminUserReviewsCount(userId)
    });

    // 유저 리뷰 불러오기
    const [page, setPage] = useState(0)

    const {
        data: reviews,
        isLoading: reviewLoading,
        isError: reviewError
    } = useQuery<AxiosResponse<PagingResponse<ReviewSimpleDTO>>>({
        queryKey: ["adminUserReviews",userId, page],
        queryFn: () => getAdminUserReviews(userId, page)
    });

    if (isLoading)
        return <LoadingComponent isLoading />;
    if (isError || !users)
        return <div className="p-4 text-red-500">유저 정보 불러오기 실패</div>;

    return (
        <div className="flex flex-col">
            <AuDetailHeaderComponent
                backgroundProfile="bg-white/80 dark:bg-gradient-to-br dark:from-white/20 dark:to-transparent"
                avatarImage={users.profileImgUrl}
                name={users.nickname}
                email={users.email}
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-[22px] px-4 py-6 ">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-[calc(100vh-60px)] flex flex-col">
                    {/* 리뷰 + 페이지네이션 컴포넌트 포함 */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 flex flex-col min-h-0">
                        <AuDetailReviewsComponent
                            reviewCount={reviewCount!}
                            reviewList={reviews?.data.content ?? []}
                            isLoading={reviewLoading}
                            isError={reviewError}
                        />
                        </div>
                        {/* 페이지네이션 - 박스 안에 하단 고정되도록 */}
                        <div>
                            <PaginationComponent
                                currentPage={page}
                                totalPages={reviews?.data.totalPages || 0}
                                onPageChange={setPage}
                                maxPageButtons={10}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-[calc(100vh-60px)] flex flex-col">
                    <AuDetailProfileComponent
                            isSocial={users.isSocial}
                            gender={users.gender}
                            nationality={users.nationality}
                            birthDate={users.birthDate}
                            status={users.status}
                            regDate={users.regDate}
                            tagIdList={users.tagIdList}
                        />
                </div>

                {/* 하단 버튼 영역 */}
                <div className="xl:col-span-2 flex justify-end">
                    <button
                        onClick={() => navigate(backToListPath)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1.5 px-4 rounded-lg"
                    >
                        목록가기
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AuDetailComponent;
