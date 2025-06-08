// src/pages/admin/notices/editPage.tsx

import { useEffect, useState, useRef, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    fetchNotice,
    updateNotice,
    uploadImages,
} from "~/api/noticeAPI";
import type {
    NoticeRequestDto,
    NoticeResponseDto,
} from "~/types/notice";
import Swal from "sweetalert2";
import "~/util/customSwal.css";

// 동일하게 VITE_API_URL을 가공하여 "http://localhost"만 남깁니다.
const rawApi = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";
const API_URL = rawApi
    .replace("http://localhost:8080/api/v1", "http://localhost")
    .replace("https://localhost:8080/api/v1", "https://localhost");

export default function EditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const formRef = useRef<HTMLFormElement>(null);

    const [initialData, setInitialData] = useState<NoticeResponseDto | null>(
        null
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    const loadNotice = async () => {
        if (!id) return;
        setLoading(true);
        setError(null);
        try {
            const res = await fetchNotice(Number(id));
            setInitialData(res.data);
        } catch (e) {
            console.error(e);
            setError("공지사항 정보를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotice();
        // eslint-disable-next-line
    }, [id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedFiles(e.target.files);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formRef.current || !id) return;

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
            imgUrls: initialData?.imgUrls || [],
        };

        try {
            await updateNotice(Number(id), dto);

            if (selectedFiles && selectedFiles.length > 0) {
                await uploadImages(Number(id), selectedFiles);
            }

            Swal.fire({
                title: "공지사항 수정 완료",
                icon: "success",
                confirmButtonText: "확인",
                customClass: {
                    popup: "custom-popup",
                    title: "custom-title",
                    actions: "custom-actions",
                    confirmButton: "custom-confirm-button",
                },
            });
            navigate(`/admin/notices/${id}`);
        } catch (e) {
            console.error(e);
            Swal.fire({
                title: "공지사항 수정 중 오류가 발생했습니다",
                icon: "error",
                confirmButtonText: "확인",
            });
        }
    };

    if (loading) return <p>로딩 중...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!initialData) return <p>존재하지 않는 공지사항입니다.</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">공지사항 수정</h1>

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
                {/* 제목 */}
                <div>
                    <label className="block mb-1 font-semibold">제목</label>
                    <input
                        type="text"
                        name="title"
                        defaultValue={initialData.title}
                        className="w-full border rounded px-3 py-2"
                        placeholder="제목을 입력하세요"
                    />
                </div>

                {/* 내용 */}
                <div>
                    <label className="block mb-1 font-semibold">내용</label>
                    <textarea
                        name="content"
                        rows={6}
                        defaultValue={initialData.content}
                        className="w-full border rounded px-3 py-2"
                        placeholder="내용을 입력하세요"
                    />
                </div>

                {/* 새 이미지 추가 */}
                <div>
                    <label className="block mb-1 font-semibold">새 이미지 추가</label>
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

                {/* 기존 이미지 미리보기 */}
                {initialData.imgUrls && initialData.imgUrls.length > 0 && (
                    <div>
                        <p className="block mb-1 font-semibold">기존 첨부 이미지</p>
                        <div className="flex space-x-2 mb-4">
                            {initialData.imgUrls.map((url) => {
                                const fullUrl = url.startsWith("http")
                                    ? url
                                    : `${API_URL}${url}`;
                                return (
                                    <a
                                        key={url}
                                        href={fullUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="border rounded overflow-hidden"
                                    >
                                        <img
                                            src={fullUrl}
                                            alt="공지 이미지"
                                            className="w-24 h-24 object-cover"
                                        />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    className="w-full py-3 font-semibold rounded-md text-base sm:text-base transition-colors bg-emerald-400 text-white hover:bg-emerald-600"
                >
                    수정하기
                </button>
            </form>
        </div>
    );
}
