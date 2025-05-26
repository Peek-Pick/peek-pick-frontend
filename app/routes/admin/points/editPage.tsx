import EditComponent from "~/components/admin/points/editComponent";
import {useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {readCoupon} from "~/api/points/pointsAPI";


function EditPage() {

    //ReactQuery로 데이터연결
    const { id } = useParams<{ id: string }>(); // useParams로 pno 값을 가져옴

    const idNumber = id ? parseInt(id, 10) : null;

    const { isFetching, data, error } = useQuery({
        queryKey: ["product", idNumber],  // queryKey에 pnoNumber 포함
        queryFn: () => readCoupon(idNumber),
        enabled:  idNumber !== null,  // pno가 null일 때 fetch하지 않음
    });

    return (
        <div>
            <EditComponent data={data} idNumber={idNumber}/>
        </div>
    );
}

export default EditPage;