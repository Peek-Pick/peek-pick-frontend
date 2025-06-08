// src/components/notice/NoticeFormComponent.tsx

import { useEffect, useRef, useState, type ChangeEvent } from "react";

import type {
    NoticeRequestDto,
    NoticeResponseDto,
} from "~/types/notice";
import { uploadImages } from "~/api/noticeAPI";

interface Props {
    initialData?: NoticeResponseDto | null;
    onSubmit: (dto: NoticeRequestDto) => void;
    submitLabel: string;
}

/**
 * 공지사항 작성/수정용 폼 컴포넌트
 *
 * - initialData: 수정 시 미리 채워줄 데이터(제목, 내용, imgUrls)
 * - onSubmit: 폼을 제출할 때 호출할 함수 (NoticeRequestDto 형태)
 * - submitLabel: 제출 버튼 텍스트 ("저장" / "수정" 등)
 */
export default function FormComponent({
                                                initialData = null,
                                                onSubmit,
                                                submitLabel,
                                            }: Props) {
    // 제목/내용/이미지 URL 상태
    const [title, setTitle] = useState<string>(initialData?.title || "");
    const [content, setContent] = useState<string>(initialData?.content || "");
    const [imgUrls, setImgUrls] = useState<string[]>(initialData?.imgUrls || []);

    // 이미지 업로드 중 로딩 상태
    const [uploading, setUploading] = useState<boolean>(false);

    // input[type="file"]에 대한 ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    // initialData가 바뀌면 상태 업데이트 (Edit 모드에서 서버 데이터를 받아올 때)
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
            setImgUrls(initialData.imgUrls);
        }
    }, [initialData]);

    // 파일 선택 시 업로드 처리
    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0 || !initialData) {
            // Add 모드에서 initialData가 없으면, 아직 공지가 생성되지 않았거나 ID가 없으므로 업로드 불가
            // 백엔드 구현상 이미지 업로드 엔드포인트가 /notices/{id}/images 이므로,
            // 공지를 먼저 생성한 뒤에 Edit 페이지에서 이미지를 추가해야 함.
            alert("이미지를 업로드하려면 먼저 공지를 저장한 후, 수정 화면에서 이미지를 추가해주세요.");
            return;
        }

        setUploading(true);
        try {
            // 백엔드 uploadImages(id, files) 호출
            await uploadImages(initialData.noticeId, files);
            // 업로드 후, 서버에서 NoticeEntity에 연결된 imgUrls가 갱신되었을 텐데
            // 편의상 클라이언트 쪽에서 다시 fetch하지 않고, 바로 화면에서 미리 보려면
            // 새로 업로드된 이미지를 서버가 어떤 URL로 저장했는지 알려줘야 함.
            // 여기서는 “수정(Edit) 후 상세로 돌아가 재조회”하는 방식으로 해결하는 것을 권장합니다.
            alert("이미지 업로드가 완료되었습니다. 상세 페이지로 돌아가 새로고침해주세요.");
            // 파일 input 초기화
            if (fileInputRef.current) fileInputRef.current.value = "";
        } catch (e) {
            console.error(e);
            alert("이미지 업로드 중 오류가 발생했습니다.");
        } finally {
            setUploading(false);
        }
    };

    // 이미지 URL 미리보기 삭제
    const handleRemoveImage = (url: string) => {
        setImgUrls((prev) => prev.filter((u) => u !== url));
    };

    // 폼 제출 핸들러
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() === "" || content.trim() === "") {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }
        const dto: NoticeRequestDto = {
            title,
            content,
            imgUrls,
        };
        onSubmit(dto);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* 제목 */}
            <div>
                <label className="block mb-1 font-semibold">제목</label>
                <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                />
            </div>

            {/* 내용 */}
            <div>
                <label className="block mb-1 font-semibold">내용</label>
                <textarea
                    className="w-full border rounded px-3 py-2 h-40"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력하세요"
                />
            </div>

            {/* 이미지 미리보기 영역 */}
            <div>
                <label className="block mb-1 font-semibold">첨부된 이미지</label>
                <div className="flex space-x-2 mb-2">
                    {imgUrls.map((url) => (
                        <div key={url} className="relative">
                            <img
                                src={url}
                                alt="공지 이미지"
                                className="w-24 h-24 object-cover rounded border"
                            />
                            <button
                                type="button"
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                                onClick={() => handleRemoveImage(url)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    {imgUrls.length === 0 && (
                        <p className="text-sm text-gray-500">등록된 이미지가 없습니다.</p>
                    )}
                </div>

                {/* 이미지 업로드 버튼 */}
                <div>
                    <button
                        type="button"
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || !initialData}
                    >
                        {uploading ? "업로드 중..." : "이미지 선택"}
                    </button>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    {!initialData && (
                        <p className="mt-1 text-sm text-red-500">
                            이미지를 업로드하려면 먼저 공지를 저장한 후, 수정 화면에서 업로드하세요.
                        </p>
                    )}
                </div>
            </div>

            {/* 제출 버튼 */}
            <div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    {submitLabel}
                </button>
            </div>
        </form>
    );
}
