import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getReview } from "~/api/reviews/reviewAPI";
import ModifyComponent from "~/components/reviews/modifyComponent";

function ModifyPage() {
    const { rid } = useParams()

    const { data } = useQuery({
        queryKey: ["review", rid],
        queryFn: () => getReview(Number(rid)),
        staleTime: 5 * 60 * 1000,
    });

    console.log(data?.data)

    return (
        <div>
            <ModifyComponent review={data?.data}></ModifyComponent>
        </div>
    );
}

export default ModifyPage;