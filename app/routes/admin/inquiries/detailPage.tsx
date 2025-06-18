import DetailComponent from "~/components/admin/inquiries/detailComponent";
import {useParams} from "react-router";
import {useQuery} from "@tanstack/react-query";
import {fetchAdminInquiry} from "~/api/inquiries/inquiriesAPI";

function DetailPage() {

    const { id } = useParams<{ id: string }>();

    const inquiryId = Number(id)

    // 문의 상세
    const { data , isLoading, isError } = useQuery<InquiryResponseDTO>({
        queryKey: ["admin-inquiries", inquiryId],
        queryFn: () => fetchAdminInquiry(inquiryId).then(res => res.data),
        enabled:  inquiryId !== null,
    });

    return (
        <div>
            <DetailComponent data={data} isLoading={isLoading} isError={isError} />
        </div>
    );
}

export default DetailPage;