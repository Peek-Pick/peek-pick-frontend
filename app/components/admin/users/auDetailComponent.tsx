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

interface UsersDetailProps {
    users: UsersDetailDTO;
    userId: number
}

function AuDetailComponent({users, userId}: UsersDetailProps) {

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

            </div>
        </div>
    );
}

export default AuDetailComponent;
