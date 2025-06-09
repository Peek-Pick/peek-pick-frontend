import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { InquiryRequestDTO } from "~/types/inquiries";
import { createInquiry, uploadImages } from "~/api/inquiriesAPI";
import AddComponent from "~/components/inquiries/addComponent";

function AddPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(dto: InquiryRequestDTO, files: FileList | null) {
        setLoading(true);
        try {
            // 1) 문의 텍스트 + 빈 imgUrls 배열로 생성
            const res = await createInquiry(dto);
            const newId = res.data.inquiryId;

            // 2) 파일 업로드 (여러 개 가능)
            if (files && files.length > 0) {
                await uploadImages(newId, files);
            }

            // 3) 완료 후 상세 페이지로 이동
            navigate(`/inquiries/${newId}`);
        } catch (error) {
            console.error("문의 등록 실패:", error);
            alert("문의 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return <AddComponent onSubmit={handleSubmit} />; // 변경: props로 handleSubmit 전달
}

export default AddPage;