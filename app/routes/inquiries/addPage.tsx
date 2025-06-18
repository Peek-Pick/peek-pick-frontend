import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImages, getUserEmail } from "~/api/inquiriesAPI";
import AddComponent from "~/components/inquiries/addComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import { useCreateInquiry } from "~/hooks/inquiries/useInquiryMutation";
import { BackButton, FloatingActionButtons } from "~/util/button/FloatingActionButtons";

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
        fetchEmail();
    }, []);

    async function handleSubmit(dto: InquiryRequestDTO, files: FileList | null) {
        if (!userEmail) {
            alert("사용자 정보를 불러오지 못했습니다. 다시 로그인해주세요.");
            return;
        }

        setLoading(true);
        try {
            // 1. 텍스트 등록
            const res = await createInquiryMutation.mutateAsync(dto);
            const newId = res.data.inquiryId;

            // 2. 이미지 업로드
            if (files && files.length > 0) {
                await uploadImages(newId, files);
            }

            navigate(`/inquiries/${newId}`);
        } catch (error) {
            console.error("문의 등록 실패:", error);
            alert("문의 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <LoadingComponent isLoading={true} />;

    return (
        <div>
            <AddComponent onSubmit={handleSubmit} userEmail={userEmail ?? ""} />

            <div className="h-15" />
            <BackButton />
            <FloatingActionButtons />
        </div>
    );
}

export default AddPage;