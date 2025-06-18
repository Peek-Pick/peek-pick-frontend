import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchInquiry } from "~/api/inquiries/inquiriesAPI";
import DetailComponent from "~/components/inquiries/detailComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import ModalComponent from "~/components/common/modalComponent";
import {BackButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";
import ReplyDetailComponent from "~/components/inquiries/reply/replyDetailComponent";

function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [inquiry, setInquiry] = useState<InquiryResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorModal, setErrorModal] = useState(false);

    useEffect(() => {
        if (!id) return;
        const parsed = parseInt(id, 10);
        if (Number.isNaN(parsed)) return;

        fetchInquiry(parsed)
            .then((res) => {
                setInquiry(res.data);
            })
            .catch((err) => {
                // if backend threw "권한이 없습니다" (HTTP 500)
                console.error(err);
                setErrorModal(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleModalClose = () => {
        setErrorModal(false);
        nav(-1);
    };

    if (loading) return <LoadingComponent isLoading={true} />;

    return (
        <div>
            {errorModal && (
                <ModalComponent
                    message={"권한이 없습니다."}
                    onClose={handleModalClose}
                />
            )}
            <BackButton />
            <FloatingActionButtons />
            {inquiry && <DetailComponent inquiry={inquiry} navigate={nav} />}
            {inquiry && inquiry.status === "ANSWERED" && <ReplyDetailComponent inquiryId={inquiry.inquiryId} />}
            <div className="h-15" />
        </div>
    );
}

export default DetailPage;
