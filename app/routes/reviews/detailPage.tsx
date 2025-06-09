import { useParams } from "react-router";
import DetailComponent from "~/components/reviews/detailComponent";
import { useQuery } from "@tanstack/react-query";
import { getReview } from "~/api/reviews/reviewAPI";

function DetailPage() {
    const { rid } = useParams()

    // 리뷰 받아오기
    const { data } = useQuery({
        queryKey: ["review", Number(rid)],
        queryFn: () => getReview(Number(rid))
    });

    return (
        <div>
            <DetailComponent review={data?.data}></DetailComponent>
        </div>
    );
}

export default DetailPage;