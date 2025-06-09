import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { InquiryResponseDTO } from "~/types/inquiries";
import { fetchInquiry } from "~/api/inquiriesAPI";
import DetailComponent from "~/components/inquiries/detailComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import ModalComponent from "~/components/common/modalComponent";

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
                // if backend threw "권한이 없습니다" (HTTP 500 in your case)
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
        <div className="p-4">
            {inquiry && <DetailComponent inquiry={inquiry} navigate={nav} />}
            <BottomNavComponent />
            {/* 임시 footer 공간 */}
            <div className="h-20" />

            {errorModal && (
                <ModalComponent
                    message={"권한이 없습니다."}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}

export default DetailPage;
