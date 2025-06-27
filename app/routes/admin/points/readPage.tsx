import ReadComponent from "~/components/admin/points/readComponent";
import {useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {readCoupon} from "~/api/points/adminPointsAPI";
import LoadingComponent from "~/components/common/loadingComponent";
import {useEffect, useState} from "react";


function ReadPage() {

    const { id } = useParams<{ id: string }>();

    const idNumber = id ? parseInt(id, 10) : null;

    const { data , isError, isLoading } = useQuery({
        queryKey: ["product", idNumber],  // queryKey에 idNumber 포함
        queryFn: () => readCoupon(idNumber),
        enabled:  idNumber !== null,  // pno가 null일 때 fetch하지 않음
    });

    // 로딩, 에러처리
    if (isLoading) return <LoadingComponent isLoading />;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;

    return (
        <div>
            <ReadComponent data={data} isLoading={isLoading} isError={isError}/>
        </div>
    );
}

export default ReadPage;