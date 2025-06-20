import AuDetailHeaderComponent from "~/components/admin/users/auDetailHeaderComponent";
import ReviewDetailInfo from "~/components/admin/reviews/reviewDetailInfo";
import ReviewMetaInfo from "~/components/admin/reviews/reviewMetaInfo";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteAdminReview, toggleAdminReview } from "~/api/reviews/adminReviewAPI";
import { useSearchParams } from "react-router";

export interface AdminReviewDetailProps {
    data: AdminReviewDetailDTO;
}

export default function ReadComponent({ data }: AdminReviewDetailProps) {
    const navigate = useNavigate();

    // 현재 URL 정보 - 페이지, 필터링
    const location = useLocation();

    // 이전 화면 (reviewList 또는 reportList)
    const [searchParams] = useSearchParams();
    const from = searchParams.get("from") || "reviewList";

    // 목록으로 버튼 경로 설정
    const backToListPath =
        from === 'reportList'
            ? `/admin/reports/list${location.search}`
            : `/admin/reviews/list${location.search}`;

    // 리뷰 삭제 핸들러
    const handleDelete = async () => {
        const confirmed = window.confirm("정말 이 리뷰를 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            await deleteAdminReview(data.reviewId);
            alert("삭제가 완료되었습니다.");
            navigate(backToListPath);
        } catch (error) {
            alert("삭제 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    // 숨김 여부 토글 핸들러
    const handleToggleHidden = async () => {
        const confirmed = window.confirm(
            data.isHidden
                ? "해당 리뷰의 숨김을 해제하시겠습니까?"
                : "해당 리뷰를 숨기시겠습니까?"
        );
        if (!confirmed) return;

        try {
            await toggleAdminReview(data.reviewId);
            alert("숨김 상태를 변경하였습니다.");
            navigate(0);
        } catch (error) {
            alert("숨김 상태 변경 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen px-4 py-6 bg-white dark:bg-gray-900">
            {/* 상단 사용자 정보 */}
            <AuDetailHeaderComponent
                backgroundProfile="/BackgroundCard1.png"
                avatarImage={data.profileImageUrl
                    ? `http://localhost/${data.profileImageUrl}`
                    : `http://localhost/basicImg.jpg`}
                name={data.nickname}
                email={`userId ${data.userId}`}
            />

            {/* 리뷰 정보 + 리뷰 내용 가로 배치 */}
            <div className="flex flex-col xl:flex-row gap-6 flex-grow mt-6">
                <div className="w-full xl:w-1/2">
                    <ReviewMetaInfo
                        title="리뷰 정보"
                        reviewId={data.reviewId}
                        productId={data.productId}
                        productName={data.name}
                        recommendCnt={data.recommendCnt}
                        reportCnt={data.reportCnt}
                        isHidden={data.isHidden}
                        regDate={new Date(data.regDate).toLocaleString()}
                        modDate={new Date(data.modDate).toLocaleString()}
                        onToggleHidden={handleToggleHidden}
                    />
                </div>
                <div className="w-full xl:w-1/2">
                    <ReviewDetailInfo
                        title="리뷰 내용"
                        score={data.score}
                        comment={data.comment}
                        images={data.images}
                        tags={data.tagList}
                    />
                </div>
            </div>

            {/* 하단 버튼 영역 */}
            <div className="flex flex-wrap justify-end gap-2 mt-6">
                <button
                    onClick={handleDelete}
                    className="bg-red-500 hover:bg-red-700 text-white py-1.5 px-4 rounded-lg"
                >
                    리뷰 삭제
                </button>
                <button
                    onClick={() => navigate(backToListPath)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1.5 px-4 rounded-lg"
                >
                    목록가기
                </button>
            </div>
        </div>
    );
}