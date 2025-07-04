import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImages, getUserEmail } from "~/api/inquiries/inquiriesAPI";
import AddComponent from "~/components/inquiries/addComponent";
import { useCreateInquiry } from "~/hooks/inquiries/useInquiryMutation";
import { BackButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import '~/util/swal/customSwal.css'

function AddPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const createInquiryMutation = useCreateInquiry();

    useEffect(() => {
        async function fetchEmail() {
            setLoading(true);
            const email = await getUserEmail();
            setUserEmail(email);
            setLoading(false);
        }
        fetchEmail();
    }, []);

    async function handleSubmit(dto: InquiryRequestDTO, files: FileList | null) {
        if (!userEmail) return;

        Swal.fire({
            title: t("inquiry.submitting"),
            allowOutsideClick: false,
            allowEscapeKey: false,
            didOpen: () => Swal.showLoading(),
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                actions: 'custom-actions',
                confirmButton: 'custom-confirm-button',
            }
        });

        try {
            const res = await createInquiryMutation.mutateAsync(dto);
            const newId = res.data.inquiryId;

            if (files && files.length > 0) {
                await uploadImages(newId, files);
            }

            await Swal.fire({
                title: t("inquiry.submitSuccess"),
                icon: "success",
                confirmButtonText: t("confirmOKButtonText"),
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            });

            navigate(`/inquiries/${newId}`, { replace: true });

        } catch (error) {
            console.error("Failed to submit inquiry", error);
            await Swal.fire({
                title: t("inquiry.submitFail"),
                icon: "error",
                confirmButtonText: t("confirmOKButtonText"),
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            });
        }
    }

    return (
        <div>
            <BackButton />
            <FloatingActionButtons />
            <AddComponent onSubmit={handleSubmit} userEmail={userEmail ?? ""} isLoading={loading}/>
            <div className="h-15" />
        </div>
    );
}

export default AddPage;