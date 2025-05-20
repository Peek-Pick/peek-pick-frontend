// app/routes/admin/notices/addPage.tsx
import { useNavigate } from "react-router-dom";
import FormComponent from "~/components/admin/notices/formComponent";
import type { NoticeRequestDto } from "~/types/notice";
import { createNotice, uploadImages } from "~/api/notice";

export default function AddPage() {
    const nav = useNavigate();

    async function handleSubmit(
        dto: NoticeRequestDto,
        files: FileList | null
    ) {
        // 1) 공지 생성
        const res = await createNotice(dto);
        const newId = res.data.noticeId;
        // 2) 파일 업로드
        if (files) await uploadImages(newId, files);
        // 3) 목록으로
        nav("/admin/notices/list");
    }

    return <FormComponent onSubmit={handleSubmit} />;
}
