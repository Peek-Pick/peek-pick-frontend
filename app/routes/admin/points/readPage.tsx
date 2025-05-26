import ReadComponent from "~/components/admin/points/readComponent";
import {useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {readCoupon} from "~/api/points/pointsAPI";


function ReadPage() {

    const { id } = useParams<{ id: string }>();

    const idNumber = id ? parseInt(id, 10) : null;

    const { data , error, isLoading } = useQuery({
        queryKey: ["product", idNumber],  // queryKey에 idNumber 포함
        queryFn: () => readCoupon(idNumber),
        enabled:  idNumber !== null,  // pno가 null일 때 fetch하지 않음
    });

    if (isLoading) return <p className="text-gray-500">상품 정보를 불러오는 중입니다...</p>;
    if (error) return <p className="text-red-500">상품 조회 중 오류 발생</p>;
    if (!data) return <p>상품 정보가 없습니다.</p>;

    return (
        <div>
            <ReadComponent data={data} />
        </div>
    );
}

export default ReadPage;