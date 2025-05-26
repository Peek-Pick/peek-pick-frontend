import { useParams } from "react-router";
import DetailComponent from "~/components/reviews/detailComponent";
import { useQuery } from "@tanstack/react-query";
import { getReview } from "~/api/reviews/reviewAPI";

function DetailPage() {
    const { rid } = useParams()

    const { data } = useQuery({
        queryKey: ["review", rid],
        queryFn: () => getReview(Number(rid)),
        staleTime: 5 * 60 * 1000,
    });

    console.log(data?.data)

    return (
        <div>
            <DetailComponent review={data?.data}></DetailComponent>
        </div>
    );
}

export default DetailPage;