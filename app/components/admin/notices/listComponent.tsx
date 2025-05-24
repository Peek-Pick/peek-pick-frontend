// app/components/admin/notices/listComponent.tsx
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
            {items.map(n => (
                <li key={n.noticeId} className="flex justify-between p-2 border rounded">
                    <Link to={`/admin/notices/${n.noticeId}`}>
                        <h3 className="font-semibold">{n.title}</h3>
                    </Link>
                    <div className="space-x-2">
                        <button onClick={() => onEdit(n.noticeId)}>수정</button>
                        <button onClick={() => onDelete(n.noticeId)}>삭제</button>
                    </div>
                </li>
            ))}
        </ul>
    );
}
