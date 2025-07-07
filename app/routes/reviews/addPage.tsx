import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import AddComponent from "~/components/reviews/addComponent";
import { getProductDetail } from "~/api/products/productsAPI"
import {useTranslation} from "react-i18next";

function AddPage() {
    const { barcode } = useParams()
    const { t, i18n } = useTranslation();
    const lang = i18n.language; // "en" | "ko" | "ja"
    // 상품 정보 가져오기
    const { data: productDetail, isLoading, isError} = useQuery({
        queryKey: ["productDetail", barcode],
        queryFn: () => getProductDetail(barcode!, lang)
    });

    return (
        <div>
            <AddComponent product={productDetail!} isLoading={isLoading} isError={isError}>
            </AddComponent>
        </div>
    );
}

export default AddPage;