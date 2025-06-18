// src/routes/admin/notices/addPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import FormComponent from "~/components/admin/notices/formComponent";
import type {
    NoticeRequestDto,
    NoticeResponseDto,
} from "~/types/notice";
import { createNotice, uploadImages } from "~/api/notices/adminNoticesAPI";
import Swal from "sweetalert2";
import "~/util/swal/customSwal.css";

export default function AddPage() {
    const navigate = useNavigate();
    const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);

    const mutation = useMutation<
        NoticeResponseDto,
        Error,
        NoticeRequestDto
    >({
        mutationFn: (dto) =>
            createNotice(dto).then((res) => res.data),
        onSuccess: (newNotice) => {
            Swal.fire("공지 등록 완료", "", "success").then(() => {
                if (pendingFiles && newNotice.noticeId) {
                    uploadImages(newNotice.noticeId, pendingFiles)
                        .finally(() => navigate("/admin/notices/list"));
                } else {
                    navigate("/admin/notices/list");
                }
            });
        },
        onError: (err: Error) => {
            console.error(err);
            Swal.fire("공지 등록 실패", "", "error");
        },
    });

    const handleSubmit = (
        dto: NoticeRequestDto,
        files?: FileList | null
    ) => {
        setPendingFiles(files ?? null);
        mutation.mutate(dto);
    };

    const handleCancel = () => navigate("/admin/notices/list");

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">새 공지 작성</h1>
            <FormComponent
                initialData={null}
                submitLabel="등록"
                onSubmit={handleSubmit}
                extraActions={
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition bg-gray-200 hover:bg-gray-300"
                    >
                        취소
                    </button>
                }
            />
        </div>
    );
}
