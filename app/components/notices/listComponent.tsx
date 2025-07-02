import { useNavigate } from "react-router-dom";
import type { NoticeListDTO } from "~/types/notice";
import { Megaphone } from "lucide-react";

interface Props {
    items: NoticeListDTO[];
}

export default function NoticeListComponent({ items }: Props) {
    const navigate = useNavigate();
    const handleDetail = (id: number) => {
        navigate(`/notices/${id}`);
    };

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 pt-4 pb-6 relative space-y-4">
            <div className="flex justify-between items-center mb-4 mt-1.5">
                <h2 className="flex items-center gap-1 text-xl font-bold text-yellow-500 select-none leading-none">
                    <Megaphone className="w-6 h-6 leading-none ml-1.5" />
                    <span className="leading-none text-black ml-1.5">Notices</span>
                </h2>
            </div>

            {items.length === 0 ? (
                <div className="py-20 text-center text-yellow-300 text-base select-none">
                    No notices have been posted.
                </div>
            ) : (
                <ul className="flex flex-col gap-5">
                    {items.map((n) => (
                        <li
                            key={n.noticeId}
                            onClick={() => handleDetail(n.noticeId)}
                            className="flex gap-4 p-4 rounded-lg bg-white shadow-sm hover:shadow-md cursor-pointer border border-black/10 transition"
                        >
                            {/* ID number */}
                            <div className="flex-shrink-0 w-8 flex items-center justify-center text-yellow-500 font-extrabold text-xl select-none">
                                {n.noticeId}
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                                {/* Title */}
                                <div className="text-base text-black line-clamp-1 mb-4 select-text">
                                    {n.title}
                                </div>

                                {/* Date */}
                                <div className="flex justify-between items-center text-xs text-gray-500 select-none">
                                    <div>Posted on: {n.regDate.slice(0, 10).replace(/-/g, ".")}</div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}