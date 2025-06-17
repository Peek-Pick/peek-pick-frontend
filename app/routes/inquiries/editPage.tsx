import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInquiry, uploadImages } from "~/api/inquiriesAPI";
import LoadingComponent from "~/components/common/loadingComponent";
import EditComponent from "~/components/inquiries/editComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import ModalComponent from "~/components/common/modalComponent";
import {useUpdateInquiry} from "~/hooks/inquiries/useInquiryMutation";

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
                console.error("문의 조회 중 오류:", err);
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
        try {
            await updateInquiryMutation.mutateAsync({ id: +id, data: dto });
            if (files && files.length > 0) {
                await uploadImages(+id, files);
            }
            navigate(`/inquiries/${id}`);
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
    };

    const handleModalClose = () => {
        setShowAuthModal(false);
        navigate(-1);
    };

    if (loading || (!data && !showAuthModal)) {
        return <LoadingComponent isLoading={true} />;
    }

    return (
        <div>
            {data && <EditComponent initialData={data} onSubmit={handleSubmit} />}
            <BottomNavComponent />
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