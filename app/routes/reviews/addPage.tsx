import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getTags } from "~/api/reviews/reviewAPI";
import AddComponent from "~/components/reviews/addComponent";
import { getProductDetail } from "~/api/productsAPI"

function AddPage() {
    const { barcode } = useParams()

    // 태그 가져오기
    const { data: tagData } = useQuery({
        queryKey: ["tags"],
        queryFn: getTags
    });
    console.log(tagData?.data)
    
    // 상품 정보 가져오기
    const { data: productDetail, isLoading, isError} = useQuery({
        queryKey: ["productDetail", barcode],
        queryFn: () => getProductDetail(barcode!)
    });
    console.log(productDetail)

    return (
        <div>
            <AddComponent product={productDetail!} tags={tagData?.data} 
                          isLoading={isLoading} isError={isError}>
            </AddComponent>
        </div>
    );
}

export default AddPage;