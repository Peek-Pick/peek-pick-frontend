import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
    InquiryResponseDTO,
    InquiryRequestDTO,
} from "~/types/inquiries";
import { fetchInquiry, updateInquiry, uploadImages } from "~/api/inquiriesAPI";
import LoadingComponent from "~/components/common/loadingComponent";
import EditComponent from "~/components/inquiries/editComponent";

function EditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [data, setData] = useState<InquiryResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetchInquiry(+id)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error("문의 조회 중 오류:", err);
                // 필요 시 에러 화면 처리
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    async function handleSubmit(dto: InquiryRequestDTO, files: FileList | null) {
        if (!id) return;
        setLoading(true);
        try {
            // 텍스트 + 기존 imgUrls만 서버로 보냄
            await updateInquiry(+id, dto);

            // 새로 선택된 파일이 있으면 업로드
            if (files && files.length > 0) {
                await uploadImages(+id, files);
            }

            navigate("/inquiries/list");
        } catch (err) {
            console.error("문의 수정 중 오류:", err);
            alert("문의 수정에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }

    if (loading || !data) {
        return <LoadingComponent isLoading={true} />;
    }

    return <EditComponent initialData={data} onSubmit={handleSubmit} />;
}

export default EditPage;