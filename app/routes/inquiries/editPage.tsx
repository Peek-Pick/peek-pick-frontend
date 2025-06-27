import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInquiry, uploadImages } from "~/api/inquiries/inquiriesAPI";
import EditComponent from "~/components/inquiries/editComponent";
import ModalComponent from "~/components/common/modalComponent";
import {useUpdateInquiry} from "~/hooks/inquiries/useInquiryMutation";
import {BackButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";
import Swal from "sweetalert2";
import '~/util/swal/customSwal.css'

function EditPage() {
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
            title: "Updating inquiry...",
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
            // 1. 텍스트 등록
            await updateInquiryMutation.mutateAsync({ id: +id, data: dto });

            // 2. 이미지 업로드
            if (files && files.length > 0) {
                await uploadImages(+id, files);
            }

            // 3. 완료 후 알림
            await Swal.fire({
                title: "Inquiry updated successfully!",
                icon: "success",
                confirmButtonText: "OK",
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
                    title: "Failed to update inquiry",
                    icon: "error",
                    confirmButtonText: "OK",
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
                    message={"Access denied."}
                    onClose={handleModalClose}
                />
            )}

            <BackButton />
            <FloatingActionButtons />
            {data && <EditComponent initialData={data} onSubmit={handleSubmit} isLoading={loading}/>}
            <div className="h-15" />
        </div>
    );
}

export default EditPage;