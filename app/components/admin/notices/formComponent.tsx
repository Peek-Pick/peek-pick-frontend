// src/components/admin/notices/NoticeFormComponent.tsx

import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import type {
    NoticeResponseDto,
    NoticeRequestDto,
} from "~/types/notice";

// nginx 서빙 호스트
const rawApi =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1";
const API_HOST = rawApi
    .replace("http://localhost:8080/api/v1", "http://localhost")
    .replace("https://localhost:8080/api/v1", "https://localhost");

interface Props {
    initialData?: NoticeResponseDto | null;
    onSubmit: (
        dto: NoticeRequestDto,
        files?: FileList | null
    ) => void;
    submitLabel: string;
    extraActions?: ReactNode;
}

export default function NoticeFormComponent({
                                                initialData = null,
                                                onSubmit,
                                                submitLabel,
                                                extraActions,
                                            }: Props) {
    const [title, setTitle] = useState(
        initialData?.title || ""
    );
    const [content, setContent] = useState(
        initialData?.content || ""
    );
    // 기존 URL 목록
    const [existingUrls, setExistingUrls] =
        useState<string[]>(initialData?.imgUrls || []);
    // 새로 고른 파일들
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const fileInputRef =
        useRef<HTMLInputElement>(null);

    // 초기 데이터 로드시 상태 세팅
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setExistingUrls(initialData.imgUrls);
        }
    }, [initialData]);

    // 파일 선택 이벤트: 누적 추가
    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const picked = e.target.files
            ? Array.from(e.target.files)
            : [];
        setNewFiles((prev) => [...prev, ...picked]);
        // input value 초기화해서 같은 파일 재선택 허용
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 기존 URL 삭제
    const removeExisting = (url: string) => {
        setExistingUrls((prev) =>
            prev.filter((u) => u !== url)
        );
    };

    // 새 파일 삭제
    const removeNewFile = (file: File) => {
        setNewFiles((prev) =>
            prev.filter((f) => f !== file)
        );
    };

    // 제출 핸들러
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요");
            return;
        }

        // dto 에 기존 URL 배열을 포함
        const dto: NoticeRequestDto = {
            title: title.trim(),
            content: content.trim(),
            imgUrls: existingUrls,
        };

        // FileList 로 변환
        const dt = new DataTransfer();
        newFiles.forEach((f) => dt.items.add(f));
        const fileList = dt.files.length
            ? dt.files
            : undefined;

        onSubmit(dto, fileList ?? null);
    };

    // 전체 선택된 개수
    const totalCount =
        existingUrls.length + newFiles.length;
    const cntLabel =
        totalCount > 0
            ? `${totalCount}개 선택됨`
            : "선택된 파일 없음";

    // 버튼 스타일
    const submitBtnClass =
        submitLabel === "수정"
            ? "flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-100 transition"
            : "flex items-center gap-1 rounded-md bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 shadow-sm hover:bg-purple-200 transition";

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 text-gray-800 max-w-2xl mx-auto space-y-6"
        >
            {/* 제목 */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                    제목
                </label>
                <input
                    type="text"
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                    placeholder="제목을 입력하세요"
                />
            </div>

            {/* 내용 */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                    내용
                </label>
                <textarea
                    rows={6}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 whitespace-pre-line leading-relaxed"
                    value={content}
                    onChange={(e) =>
                        setContent(e.target.value)
                    }
                    placeholder="내용을 입력하세요"
                />
            </div>

            {/* 이미지 미리보기(기존 + 새로 고른) */}
            {(existingUrls.length > 0 || newFiles.length > 0) && (
                <div className="flex flex-wrap gap-3">
                    {/* 기존 URL */}
                    {existingUrls.map((url) => {
                        const full = url.startsWith("http")
                            ? url
                            : `${API_HOST}${url}`;
                        return (
                            <div
                                key={url}
                                className="relative w-24 h-24 border rounded overflow-hidden"
                            >
                                <img
                                    src={full}
                                    alt="공지 이미지"
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        (e.currentTarget.src = "")
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeExisting(url)
                                    }
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}

                    {/* 새로 고른 File */}
                    {newFiles.map((file, idx) => (
                        <div
                            key={idx}
                            className="relative w-24 h-24 border rounded overflow-hidden"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt="new"
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    removeNewFile(file)
                                }
                                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* 이미지 선택 버튼 + 상태 */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                    이미지 파일
                </label>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                        className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 transition"
                    >
                        <FontAwesomeIcon icon={faImage} />
                        이미지 선택
                    </button>
                    <span className="text-gray-600 truncate max-w-xs">
            {cntLabel}
          </span>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                />
            </div>

            {/* 제출 & 추가 액션 */}
            <div className="flex justify-end gap-2">
                {extraActions}
                <button
                    type="submit"
                    className={submitBtnClass}
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
