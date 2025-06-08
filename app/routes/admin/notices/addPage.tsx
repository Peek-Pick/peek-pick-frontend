import { useState } from "react";                          // ← useState 임포트
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import FormComponent from "~/components/admin/notices/formComponent";  // your file
import type {
    NoticeRequestDto,
    NoticeResponseDto,
} from "~/types/notice";
import { createNotice, uploadImages } from "~/api/noticeAPI";
import Swal from "sweetalert2";
import "~/util/customSwal.css";

export default function AddPage() {
    const navigate = useNavigate();
    const [pendingFiles, setPendingFiles] = useState<FileList | null>(null);

    const mutation = useMutation<
        NoticeResponseDto,        // onSuccess 로 넘어오는 타입
        Error,                    // onError 로 넘어오는 에러 타입
        NoticeRequestDto          // mutate() 에 넘기는 변수 타입
    >({
        mutationFn: (dto) =>
            createNotice(dto).then((res) => res.data),              // AxiosResponse → unwrap .data
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

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">새 공지 작성</h1>
            <button
                className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => navigate("/admin/notices/list")}
            >
                취소
            </button>
            <FormComponent
                initialData={null}
                submitLabel="등록하기"
                onSubmit={handleSubmit}
            />
        </div>
    );
}
