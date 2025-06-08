// src/pages/admin/notices/addPage.tsx

import { useRef, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { createNotice, uploadImages } from "~/api/noticeAPI";
import { useNavigate } from "react-router-dom";
import type { NoticeRequestDto } from "~/types/notice";
import Swal from "sweetalert2";
import "~/util/customSwal.css";

export default function AddPage() {
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);

    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    // React-Query v4의 useMutation에서는 status가 "idle" | "pending" | "success" | "error" 중 하나입니다.
    // 따라서 loading 대신 "pending"으로 비교해야 합니다.
    const { mutate: createMutate, status } = useMutation({
        mutationFn: (dto: NoticeRequestDto) => createNotice(dto),
        onSuccess: (res) => {
            const newId = res.data.noticeId;
            if (selectedFiles && newId) {
                uploadImages(newId, selectedFiles)
                    .then(() => {
                        Swal.fire({
                            title: "공지사항 등록 완료",
                            icon: "success",
                            confirmButtonText: "확인",
                            customClass: {
                                popup: "custom-popup",
                                title: "custom-title",
                                actions: "custom-actions",
                                confirmButton: "custom-confirm-button",
                            },
                        });
                        navigate("/admin/notices/list");
                    })
                    .catch((e) => {
                        console.error(e);
                        Swal.fire({
                            title: "이미지 업로드 중 오류가 발생했습니다",
                            icon: "error",
                            confirmButtonText: "확인",
                        });
                        navigate("/admin/notices/list");
                    });
            } else {
                Swal.fire({
                    title: "공지사항 등록 완료",
                    icon: "success",
                    confirmButtonText: "확인",
                    customClass: {
                        popup: "custom-popup",
                        title: "custom-title",
                        actions: "custom-actions",
                        confirmButton: "custom-confirm-button",
                    },
                });
                navigate("/admin/notices/list");
            }
        },
        onError: (error) => {
            console.error(error);
            Swal.fire({
                title: "공지사항 등록 중 오류가 발생했습니다",
                icon: "error",
                confirmButtonText: "확인",
            });
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current) return;

        const formData = new FormData(formRef.current);
        const rawTitle = formData.get("title");
        const rawContent = formData.get("content");

        const title =
            typeof rawTitle === "string" ? rawTitle.trim() : "";
        const content =
            typeof rawContent === "string" ? rawContent.trim() : "";

        if (!title || !content) {
            Swal.fire({
                title: "제목과 내용을 모두 입력해주세요",
                icon: "warning",
                confirmButtonText: "확인",
            });
            return;
        }

        const dto: NoticeRequestDto = {
            title,
            content,
            imgUrls: [],
        };

        createMutate(dto);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">새 공지 작성</h1>

            <button
                className="mb-4 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => navigate("/admin/notices/list")}
            >
                목록으로 돌아가기
            </button>

            <form
                ref={formRef}
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-6"
            >
                {/* 제목 입력 */}
                <div>
                    <label className="block mb-1 font-semibold">제목</label>
                    <input
                        type="text"
                        name="title"
                        className="w-full border rounded px-3 py-2"
                        placeholder="제목을 입력하세요"
                    />
                </div>

                {/* 내용 입력 */}
                <div>
                    <label className="block mb-1 font-semibold">내용</label>
                    <textarea
                        name="content"
                        rows={6}
                        className="w-full border rounded px-3 py-2"
                        placeholder="내용을 입력하세요"
                    />
                </div>

                {/* 이미지 첨부 */}
                <div>
                    <label className="block mb-1 font-semibold">이미지 첨부</label>
                    <input
                        type="file"
                        name="files"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block"
                    />
                    {selectedFiles && selectedFiles.length > 0 && (
                        <p className="text-sm text-gray-600 mt-1">
                            {selectedFiles.length}개의 이미지 선택됨
                        </p>
                    )}
                </div>

                {/* 제출 버튼 - status가 "pending"(로딩 중)일 때 비활성화 */}
                <button
                    type="submit"
                    disabled={status === "pending"}
                    className={`w-full py-3 font-semibold rounded-md text-base sm:text-base transition-colors
            ${status === "pending"
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-emerald-400 text-white hover:bg-emerald-600"
                    }`}
                >
                    {status === "pending" ? "등록 중..." : "공지 등록하기"}
                </button>
            </form>
        </div>
    );
}
