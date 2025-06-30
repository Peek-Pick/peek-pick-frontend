import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImages, getUserEmail } from "~/api/inquiries/inquiriesAPI";
import AddComponent from "~/components/inquiries/addComponent";
import { useCreateInquiry } from "~/hooks/inquiries/useInquiryMutation";
import { BackButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";
import Swal from "sweetalert2";
import '~/util/swal/customSwal.css'

function AddPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const createInquiryMutation = useCreateInquiry();

    // 페이지 진입 시 사용자 이메일 조회
    useEffect(() => {
        async function fetchEmail() {
            setLoading(true);
            const email = await getUserEmail();
            setUserEmail(email);
            setLoading(false);
        }
        fetchEmail().then();
    }, []);

    async function handleSubmit(dto: InquiryRequestDTO, files: FileList | null) {
        if (!userEmail) {
            return;
        }

        Swal.fire({
            title: "Submitting inquiry...",
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
            const res = await createInquiryMutation.mutateAsync(dto);
            const newId = res.data.inquiryId;

            // 2. 이미지 업로드
            if (files && files.length > 0) {
                await uploadImages(newId, files);
            }

            // 3. 완료 후 알림
            await Swal.fire({
                title: "Inquiry submitted successfully",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            });

            // 4. 페이지 이동 (히스토리 남기지 않음)
            navigate(`/inquiries/${newId}`, { replace: true });

        } catch (error) {
            console.error("Failed to submit inquiry");
            await Swal.fire({
                title: "Failed to submit inquiry",
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