import { useLocation, useNavigate } from "react-router-dom";
import { INQUIRY_STATUS_LABELS, INQUIRY_TYPES } from "~/enums/inquiries/inquiry";

interface ListComponentProps extends FetchAdminInquiriesParams {
    items: InquiryResponseDTO[];
}

function ListComponent({ items }: { items: InquiryResponseDTO[] } & FetchAdminInquiriesParams) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleRowClick = (id: number) => {
        const query = location.search;
        navigate(`/admin/inquiries/${id}${query}`);
    };

    const formatDate = (iso: string) => {
        const d = new Date(iso);
        const pad = (n: number) => n.toString().padStart(2, "0");
        return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };

    const displayItems = [...items].sort((a, b) => b.inquiryId - a.inquiryId);

    const headers = ['#', '유형', '내용', '작성일', '수정일', '닉네임', '상태', '삭제여부'];

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm divide-y divide-gray-200 table-fixed">
                    <colgroup>
                        <col className="w-16" />
                        <col className="w-24" />
                        <col className="w-48" />
                        <col className="w-36" />
                        <col className="w-36" />
                        <col className="w-32" />
                        <col className="w-24" />
                        <col className="w-24" />
                    </colgroup>
                    <thead className="bg-gray-50">
                    <tr>
                        {headers.map((col) => (
                            <th key={col}
                                className="px-4 py-2 text-left text-xs font-normal text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                {col}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {displayItems.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
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
                                    <td className="px-4 py-3.5">{item.inquiryId}</td>
                                    <td className="px-4 py-3.5">{typeLabel}</td>
                                    <td className="px-4 py-3.5 truncate max-w-[12rem]"> {item.content} </td>
                                    <td className="px-4 py-3.5">{formatDate(item.regDate)}</td>
                                    <td className="px-4 py-3.5">{isSameDate ? "" : formatDate(item.modDate)}</td>
                                    <td className="px-4 py-3.5 truncate max-w-[128px]">{item.userNickname}</td>
                                    <td className="px-4 py-3.5">
                                        <div
                                            className={`inline-block px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap truncate ${
                                                item.status === 'PENDING'
                                                    ? "bg-gray-200 text-gray-700"
                                                    : "bg-green-200 text-green-800"
                                            }`}
                                        >
                                            {statusLabel}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3.5">
                                        {item.isDelete && (
                                            <span className="text-red-500 font-semibold">삭제됨</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ListComponent;