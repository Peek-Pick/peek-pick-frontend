// src/components/notices/listComponent.tsx
import { useNavigate } from "react-router-dom";
import type { NoticeListDTO } from "~/types/notice";

interface Props {
    items: NoticeListDTO[];
}

export default function NoticeListComponent({ items }: Props) {
    const navigate = useNavigate();
    const handleDetail = (id: number) => {
        navigate(`/notices/${id}`);
    };

    return (
        <ul className="flex flex-col gap-4">
            {items.length === 0 ? (
                <li className="py-8 text-center text-gray-400 text-sm">
                    등록된 공지사항이 없습니다.
                </li>
            ) : (
                items.map((n) => (
                    <li
                        key={n.noticeId}
                        onClick={() => handleDetail(n.noticeId)}
                        className="flex justify-between items-center px-4 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 cursor-pointer shadow-sm"
                    >
                        <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs text-yellow-500 font-semibold whitespace-nowrap">
                #{n.noticeId}
              </span>
                            <span className="text-sm text-gray-800 truncate">
                {n.title}
              </span>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                            {n.regDate.slice(0, 10).replace(/-/g, ".")}
                        </div>
                    </li>
                ))
            )}
        </ul>
    );
}
