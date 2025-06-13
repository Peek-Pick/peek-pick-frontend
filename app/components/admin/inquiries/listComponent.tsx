import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {INQUIRY_STATUS_LABELS, INQUIRY_TYPES} from "~/enums/inquiries/inquiry";

interface AdminInquiryListComponentProps {
    items: InquiryResponseDTO[];
    size: number;
    onSizeChange: (newSize: number) => void;
}

function ListComponent({ items }: AdminInquiryListComponentProps) {
    const navigate = useNavigate();
    const [showPendingOnly, setShowPendingOnly] = useState(false);

    const handleRowClick = (id: number) => {
        navigate(`/admin/inquiries/${id}`);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    // 기본 필터: 답변 대기 여부로 필터링
    const filteredItems = showPendingOnly
        ? items.filter((item) => item.status === "PENDING")
        : items;

    // 문의번호 내림차순 정렬 (큰 번호가 먼저)
    const displayItems = [...filteredItems].sort((a, b) => b.inquiryId - a.inquiryId);

    return (
        <div>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm divide-y divide-gray-200 table-fixed">
                        <colgroup>
                            <col className="w-16"/><col className="w-24"/><col className="w-80"/>
                            <col className="w-36"/><col className="w-36"/><col className="w-32"/>
                            <col className="w-24"/><col className="w-24"/>
                        </colgroup>
                        <thead className="bg-gray-100">
                        <tr>
                            {['ID','유형','제목','작성일','수정일','닉네임','상태','삭제여부'].map((col) => (
                                <th key={col} className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {displayItems.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-4 text-center text-gray-500">
                                    조회된 문의가 없습니다.
                                </td>
                            </tr>
                        ) : (
                            displayItems.map((item) => {
                                const typeLabel = INQUIRY_TYPES.find((t) => t.value === item.type)?.label ?? item.type;
                                const statusLabel = INQUIRY_STATUS_LABELS[item.status] ?? item.status;
                                const isSameDate = new Date(item.regDate).getTime() === new Date(item.modDate).getTime();

                                return (
                                    <tr
                                        key={item.inquiryId}
                                        onClick={() => handleRowClick(item.inquiryId)}
                                        className="hover:bg-gray-100 cursor-pointer text-gray-800"
                                    >
                                        <td className="px-4 py-3.5">
                                            <div className="overflow-hidden whitespace-nowrap truncate">{item.inquiryId}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="overflow-hidden whitespace-nowrap truncate">{typeLabel}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="overflow-hidden whitespace-nowrap truncate max-w-[320px]">{item.title}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="overflow-hidden whitespace-nowrap truncate">{formatDate(item.regDate)}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="overflow-hidden whitespace-nowrap truncate">{isSameDate ? "" : formatDate(item.modDate)}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="overflow-hidden whitespace-nowrap truncate max-w-[128px]">{item.userNickname}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="overflow-hidden whitespace-nowrap truncate">{statusLabel}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="overflow-hidden whitespace-nowrap truncate">{item.isDelete && <span className="text-red-500 font-semibold">삭제됨</span>}</div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ListComponent