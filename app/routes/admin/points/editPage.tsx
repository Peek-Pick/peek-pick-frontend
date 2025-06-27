import EditComponent from "~/components/admin/points/editComponent";
import {useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {readCoupon} from "~/api/points/adminPointsAPI";
import PointsLoading from "~/util/loading/pointsLoading";
import {ErrorComponent} from "~/util/loading/errorComponent";
import LoadingComponent from "~/components/common/loadingComponent";


function EditPage() {

    //ReactQuery로 데이터연결
    const { id } = useParams<{ id: string }>(); // useParams로 pno 값을 가져옴

    const idNumber = id ? parseInt(id, 10) : null;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["product", idNumber],  // queryKey에 pnoNumber 포함
        queryFn: () => readCoupon(idNumber),
        enabled:  idNumber !== null,  // pno가 null일 때 fetch하지 않음
    });

    // 로딩, 에러처리
    if (isLoading) return <LoadingComponent isLoading />;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;

    return (
        <div>
            <EditComponent data={data} idNumber={idNumber}/>
        </div>
    );
}

export default EditPage;