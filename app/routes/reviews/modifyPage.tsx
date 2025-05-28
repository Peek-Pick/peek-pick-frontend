import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getReview, getTags } from "~/api/reviews/reviewAPI";
import ModifyComponent from "~/components/reviews/modifyComponent";

function ModifyPage() {
    const { rid } = useParams()

    const { data } = useQuery({
        queryKey: ["review", rid],
        queryFn: () => getReview(Number(rid))
    });
    console.log(data?.data)

    const { data: tagData } = useQuery({
        queryKey: ["tags"],
        queryFn: getTags,
        staleTime: 10 * 60 * 1000,
    });
    console.log(tagData?.data)

    return (
        <div>
            <ModifyComponent tags={tagData?.data} review={data?.data}></ModifyComponent>
        </div>
    );
}

export default ModifyPage;