// src/routes/admin/notices/editPage.tsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import FormComponent from "~/components/admin/notices/formComponent";
import type {
    NoticeRequestDto,
    NoticeResponseDto,
} from "~/types/notice";
import {
    fetchNotice,
    updateNotice,
    uploadImages,
    deleteNotice,
} from "~/api/notices/adminNoticesAPI";
import Swal from "sweetalert2";

export default function EditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] = useState<NoticeResponseDto | null>(null);
    const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);

    // 기존 공지 로드
    useEffect(() => {
        if (!id) return;
        fetchNotice(Number(id)).then((dto) => setInitialData(dto));
    }, [id]);

    // 수정 뮤테이션
    const updateMut = useMutation<
        NoticeResponseDto,
        Error,
        NoticeRequestDto
    >({
        mutationFn: (dto) =>
            updateNotice(Number(id), dto).then((res) => res.data),
        onSuccess: (updated) => {
            Swal.fire("수정 완료", "", "success").then(() => {
                if (pendingFiles && updated.noticeId) {
                    uploadImages(updated.noticeId, pendingFiles)
                        .then(() =>
                            navigate(`/admin/notices/${updated.noticeId}`)
                        )
                        .catch((e) => {
                            console.error(e);
                            Swal.fire("이미지 업로드 실패", "", "error").then(() =>
                                navigate(`/admin/notices/${updated.noticeId}`)
                            );
                        });
                } else {
                    navigate(`/admin/notices/${updated.noticeId}`);
                }
            });
        },
        onError: (err: Error) => {
            console.error(err);
            Swal.fire("수정 실패", "", "error");
        },
    });

    // 삭제 뮤테이션
    const deleteMut = useMutation({
        mutationFn: () => deleteNotice(Number(id)),
        onSuccess: () => navigate("/admin/notices/list"),
    });

    if (!initialData) return null;

    const handleSubmit = (
        dto: NoticeRequestDto,
        files?: FileList | null
    ) => {
        setPendingFiles(files ?? null);
        updateMut.mutate(dto);
    };

    const handleDelete = () => {
        if (confirm("정말 삭제하시겠습니까?")) {
            deleteMut.mutate();
        }
    };

    const handleCancel = () => navigate(`/admin/notices/${id}`);

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">공지사항 수정</h1>
            <FormComponent
                initialData={initialData}
                submitLabel="수정"
                onSubmit={handleSubmit}
                extraActions={
                    <>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium shadow-sm transition bg-gray-200 hover:bg-gray-300"
                        >
                            취소
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium text-red-600 bg-red-200 shadow-sm hover:bg-red-300 transition"
                        >
                            삭제
                        </button>
                    </>
                }
            />
        </div>
    );
}
