import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { InquiryRequestDTO } from "~/types/inquiries";
import { createInquiry, uploadImages } from "~/api/inquiriesAPI";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import AddComponent from "~/components/inquiries/addComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import { useQueryClient } from "@tanstack/react-query";

function AddPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(dto: InquiryRequestDTO, files: FileList | null) {
        setLoading(true);
        try {
            // 1. 텍스트 등록
            const res = await createInquiry(dto);
            const newId = res.data.inquiryId;

            // 2. 이미지 업로드
            if (files && files.length > 0) {
                await uploadImages(newId, files);
            }

            // 3. 쿼리 무효화 및 이동
            await queryClient.invalidateQueries({ queryKey: ["inquiries"] });
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
            <AddComponent onSubmit={handleSubmit} />
            <BottomNavComponent />
        </div>
    );
}

export default AddPage;