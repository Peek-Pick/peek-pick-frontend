import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { InquiryResponseDTO } from "~/types/inquiries";
import { fetchInquiry } from "~/api/inquiriesAPI";
import DetailComponent from "~/components/inquiries/detailComponent";
import LoadingComponent from "~/components/common/loadingComponent";

function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [inquiry, setInquiry] = useState<InquiryResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const parsed = parseInt(id, 10);
        if (Number.isNaN(parsed)) return;

        fetchInquiry(parsed)
            .then((res) => setInquiry(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <LoadingComponent isLoading={true} />;

    return (
        <div className="p-4">
            {inquiry && (
                <DetailComponent
                    inquiry={inquiry}
                    navigate={nav}
                />
            )}
        </div>
    );
}

export default DetailPage;

