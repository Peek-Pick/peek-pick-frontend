import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchInquiry } from "~/api/inquiries/inquiriesAPI";
import DetailComponent from "~/components/inquiries/detailComponent";
import { BackButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";
import ReplyDetailComponent from "~/components/inquiries/reply/replyDetailComponent";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import '~/util/swal/customSwal.css';

function DetailPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const { t } = useTranslation();
    const [inquiry, setInquiry] = useState<InquiryResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const parsed = parseInt(id, 10);
        if (Number.isNaN(parsed)) return;

        fetchInquiry(parsed)
            .then((res) => {
                setInquiry(res.data);
            })
            .catch((err) => {
                console.error(err);
                Swal.fire({
                    title: t("accessDenied"),
                    icon: "error",
                    confirmButtonText: t("confirmOKButtonText"),
                    customClass: {
                        popup: 'custom-popup',
                        title: 'custom-title',
                        actions: 'custom-actions',
                        confirmButton: 'custom-confirm-button',
                    },
                }).then(() => nav(-1));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id, nav, t]);

    return (
        <div>
            <BackButton />
            <FloatingActionButtons />
            <DetailComponent inquiry={inquiry} navigate={nav} isLoading={loading} />
            {inquiry && inquiry.status === "ANSWERED" && (
                <ReplyDetailComponent inquiryId={inquiry.inquiryId} />
            )}
            <div className="h-15" />
        </div>
    );
}

export default DetailPage;