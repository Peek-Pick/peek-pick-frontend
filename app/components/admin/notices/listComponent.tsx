// src/app/components/admin/notices/listComponent.tsx
import { Link } from "react-router-dom";
import type { NoticeResponseDto } from "~/types/notice";

interface Props {
    items: NoticeResponseDto[];     // 반드시 배열 타입
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ListComponent({ items, onEdit, onDelete }: Props) {
    if (!Array.isArray(items)) {
        console.warn("ListComponent: items is not an array", items);
        return null;
    }

    return (
        <ul className="space-y-2">
            {items.map((n) => (
                <li
                    key={n.noticeId}                        // ← 고유한 key 추가
                    className="flex justify-between p-2 border rounded hover:bg-gray-50"
                >
                    <Link
                        to={`/admin/notices/${n.noticeId}`}
                        className="flex-1 font-semibold hover:underline"
                    >
                        {n.title}
                    </Link>
                    <div className="space-x-2">
                        <button
                            onClick={() => onEdit(n.noticeId)}
                            className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                        >
                            수정
                        </button>
                        <button
                            onClick={() => onDelete(n.noticeId)}
                            className="px-2 py-1 text-sm bg-red-500 text-white rounded"
                        >
                            삭제
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
