import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInquiry, uploadImages } from "~/api/inquiries/inquiriesAPI";
import EditComponent from "~/components/inquiries/editComponent";
import ModalComponent from "~/components/common/modalComponent";
import { useUpdateInquiry } from "~/hooks/inquiries/useInquiryMutation";
import { BackButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import '~/util/swal/customSwal.css'

function EditPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<InquiryResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const updateInquiryMutation = useUpdateInquiry();

    useEffect(() => {
        if (!id) return;
        fetchInquiry(+id)
            .then((res) => setData(res.data))
            .catch((err) => {
                if (err.response?.status === 500) {
                    setShowAuthModal(true);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (dto: InquiryRequestDTO, files: FileList | null) => {
        if (!id) return;
        setLoading(true);

        Swal.fire({
            title: t("inquiry.updating", "Updating inquiry..."),
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => {
                Swal.showLoading();
            },
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                actions: 'custom-actions',
                confirmButton: 'custom-confirm-button',
            }
        });

        try {
            await updateInquiryMutation.mutateAsync({ id: +id, data: dto });

            if (files && files.length > 0) {
                await uploadImages(+id, files);
            }

            await Swal.fire({
                title: t("inquiry.updateSuccess", "Inquiry updated successfully!"),
                icon: "success",
                confirmButtonText: t("confirmOKButtonText", "OK"),
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            });
            navigate(`/inquiries/${id}`);

        } catch (err: any) {
            if (err.response?.status === 500) {
                setShowAuthModal(true);
            } else {
                console.error("Failed to update inquiry");
                await Swal.fire({
                    title: t("inquiry.updateFail", "Failed to update inquiry"),
                    icon: "error",
                    confirmButtonText: t("confirmOKButtonText", "OK"),
                    customClass: {
                        popup: 'custom-popup',
                        title: 'custom-title',
                        actions: 'custom-actions',
                        confirmButton: 'custom-confirm-button',
                    }
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleModalClose = () => {
        setShowAuthModal(false);
        navigate(-1);
    };

    return (
        <div>
            {showAuthModal && (
                <ModalComponent
                    message={t("accessDenied", "Access denied.")}
                    onClose={handleModalClose}
                />
            )}
            <BackButton />
            <FloatingActionButtons />
            {data && <EditComponent initialData={data} onSubmit={handleSubmit} isLoading={loading} />}
            <div className="h-15" />
        </div>
    );
}

export default EditPage;