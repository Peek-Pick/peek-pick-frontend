import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
    InquiryResponseDTO,
    InquiryRequestDTO,
} from "~/types/inquiries";
import { fetchInquiry, updateInquiry, uploadImages } from "~/api/inquiriesAPI";
import LoadingComponent from "~/components/common/loadingComponent";
import EditComponent from "~/components/inquiries/editComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import ModalComponent from "~/components/common/modalComponent";

function EditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<InquiryResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetchInquiry(+id)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error("문의 조회 중 오류:", err);
                // 500 이거나 권한 관련 에러면 모달 띄우기
                if (err.response?.status === 500) {
                    setShowAuthModal(true);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    async function handleSubmit(dto: InquiryRequestDTO, files: FileList | null) {
        if (!id) return;
        setLoading(true);
        try {
            await updateInquiry(+id, dto);
            if (files && files.length > 0) {
                await uploadImages(+id, files);
            }
            navigate("/inquiries/list");
        } catch (err: any) {
            console.error("문의 수정 중 오류:", err);
            if (err.response?.status === 500) {
                setShowAuthModal(true);
            } else {
                alert("문의 수정에 실패했습니다.");
            }
        } finally {
            setLoading(false);
        }
    }

    // 모달 확인 시 이전 페이지로 돌아가기
    const handleModalClose = () => {
        setShowAuthModal(false);
        navigate(-1);
    };

    if (loading || (!data && !showAuthModal)) {
        return <LoadingComponent isLoading={true} />;
    }

    return (
        <div className="p-4">
            {data && <EditComponent initialData={data} onSubmit={handleSubmit} />}
            <BottomNavComponent />
            {/* 임시 footer 공간 */}
            <div className="h-20" />

            {showAuthModal && (
                <ModalComponent
                    message={"권한이 없습니다."}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}

export default EditPage;