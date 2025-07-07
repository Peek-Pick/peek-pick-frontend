import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getReview } from "~/api/reviews/reviewAPI";
import ModifyComponent from "~/components/reviews/modifyComponent";
import {useTranslation} from "react-i18next";

function ModifyPage() {
    const { rid } = useParams()
    const { i18n } = useTranslation();
    const lang = i18n.language;
    // 리뷰 정보 가져오기
    const { data, isLoading, isError } = useQuery({
        queryKey: ["review", Number(rid)],
        queryFn: () => getReview(Number(rid), lang)
    });

    return (
        <div>
            <ModifyComponent review={data?.data} isLoading={isLoading} isError={isError}>

            </ModifyComponent>
        </div>
    );
}

export default ModifyPage;