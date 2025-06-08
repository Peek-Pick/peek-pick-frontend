import ReadComponent from "~/components/admin/reviews/readComponent";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getAdminReviewDetail } from "~/api/reviews/adminReviewAPI";

function ReadPage() {
    const { rid } = useParams<{ rid: string }>();

    const reviewId = Number(rid)

    const { data , isLoading, isError } = useQuery<AdminReviewDetailDTO>({
        queryKey: ["adminReview", reviewId],
        queryFn: () => getAdminReviewDetail(reviewId),
        enabled:  reviewId !== null,
    });
    console.log(data)

    if (isLoading) return <div className="p-4 text-gray-600">Loading...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">An error occurred</div>;

    return(
        <div>
            <ReadComponent data={data} />
        </div>
    )
}

export default ReadPage;