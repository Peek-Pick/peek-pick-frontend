import { useState, useEffect } from "react";                  // ← useState, useEffect 임포트
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
} from "~/api/noticeAPI";
import Swal from "sweetalert2";

export default function EditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [initialData, setInitialData] =
        useState<NoticeResponseDto | null>(null);
    const [pendingFiles, setPendingFiles] =
        useState<FileList | null>(null);

    // 기존 공지 로드
    useEffect(() => {
        if (!id) return;
        fetchNotice(Number(id)).then(dto => setInitialData(dto));
    }, [id]);

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
                            Swal.fire("이미지 업로드 실패", "", "error")
                                .then(() =>
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

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                공지사항 수정
            </h1>
            <div className="flex gap-2 mb-4">
                <button
                    className="px-4 py-2 bg-gray-200 rounded"
                    onClick={() =>
                        navigate(`/admin/notices/${id}`)
                    }
                >
                    취소
                </button>
                <button
                    className="px-4 py-2 bg-red-200 rounded"
                    onClick={handleDelete}
                >
                    삭제
                </button>
            </div>
            <FormComponent
                initialData={initialData}
                submitLabel="수정"
                onSubmit={handleSubmit}
            />
        </div>
    );
}
