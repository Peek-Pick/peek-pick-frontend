import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import AddComponent from "~/components/reviews/addComponent";
import { getProductDetail } from "~/api/productsAPI"

function AddPage() {
    const { barcode } = useParams()
    
    // 상품 정보 가져오기
    const { data: productDetail, isLoading, isError} = useQuery({
        queryKey: ["productDetail", barcode],
        queryFn: () => getProductDetail(barcode!)
    });

    return (
        <div>
            <AddComponent product={productDetail!} isLoading={isLoading} isError={isError}>
            </AddComponent>
        </div>
    );
}

export default AddPage;