// app/components/admin/notices/formComponent.tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import type {
    NoticeRequestDto,
    NoticeResponseDto,
} from "~/types/notice";

interface Props {
    initial?: NoticeResponseDto;
    onSubmit: (
        dto: NoticeRequestDto,
        files: FileList | null
    ) => Promise<void>;
}

export default function FormComponent({
                                          initial,
                                          onSubmit,
                                      }: Props) {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [content, setContent] = useState(initial?.content ?? "");
    const [files, setFiles] = useState<FileList | null>(null);

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        setFiles(e.target.files);
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const dto: NoticeRequestDto = {
            title,
            content,
            imgUrls: initial?.imgUrls ?? [],  // **빈 배열** 또는 기존 URL 채우기
        };
        await onSubmit(dto, files);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                className="w-full border p-2"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
                className="w-full border p-2 h-40"
            />
            <input type="file" multiple onChange={handleFileChange} />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white">
                저장
            </button>
        </form>
    );
}
