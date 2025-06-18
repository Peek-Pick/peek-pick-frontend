import ReadComponent from "~/components/admin/reviews/readComponent";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminReviewDetail } from "~/api/reviews/adminReviewAPI";

function ReadPage() {
    const { rid } = useParams<{ rid: string }>();

    const reviewId = Number(rid)

    // 리뷰 상세
    const { data , isLoading, isError } = useQuery<AdminReviewDetailDTO>({
        queryKey: ["adminReview", reviewId],
        queryFn: () => getAdminReviewDetail(reviewId),
        enabled:  reviewId !== null,
    });

    return(
        <div>
            <ReadComponent data={data} isLoading={isLoading} isError={isError} />
        </div>
    )
}

export default ReadPage;