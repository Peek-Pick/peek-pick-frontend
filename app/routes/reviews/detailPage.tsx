import { useParams } from "react-router";
import DetailComponent from "~/components/reviews/detailComponent";
import { useQuery } from "@tanstack/react-query";
import { getReview } from "~/api/reviews/reviewAPI";
import {useTranslation} from "react-i18next";

function DetailPage() {
    const { rid } = useParams()
    const { i18n } = useTranslation();
    const lang = i18n.language;

    // 리뷰 받아오기
    const { data, isLoading, isError} = useQuery({
        queryKey: ["review", Number(rid)],
        queryFn: () => getReview(Number(rid), lang)
    });

    return (
        <div>
            <DetailComponent review={data?.data} isLoading={isLoading} isError={isError}></DetailComponent>
        </div>
    );
}

export default DetailPage;