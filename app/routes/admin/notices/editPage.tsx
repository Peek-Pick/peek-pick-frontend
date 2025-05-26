// app/routes/admin/notices/[id]/editPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FormComponent from "~/components/admin/notices/formComponent";
import type {
    NoticeResponseDto,
    NoticeRequestDto,
} from "~/types/notice";
import {
    fetchNotice,
    updateNotice,
    uploadImages,
} from "~/api/notice";

export default function EditPage() {
    const { id } = useParams<{ id: string }>();
    const nav = useNavigate();
    const [data, setData] = useState<NoticeResponseDto>();

    useEffect(() => {
        if (id) fetchNotice(+id).then((r) => setData(r.data));
    }, [id]);

    async function handleSubmit(
        dto: NoticeRequestDto,
        files: FileList | null
    ) {
        if (!id) return;
        await updateNotice(+id, dto);
        if (files) await uploadImages(+id, files);
        nav("/admin/notices/list");
    }

    if (!data) return <div>로딩 중...</div>;
    return (
        <FormComponent initial={data} onSubmit={handleSubmit} />
    );
}
