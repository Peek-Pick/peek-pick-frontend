// src/components/admin/notices/listComponent.tsx

import { useNavigate } from "react-router";
import type { NoticeResponseDto } from "~/types/notice";
import PaginationComponent from "~/components/common/PaginationComponent";
import LoadingComponent from "~/components/common/loadingComponent";

interface Props {
    notices?: NoticeResponseDto[];
    isLoading?: boolean;
    isError?: boolean;
    page: number;
    size: number;
    totalElements: number;
    setPage: (page: number) => void;
}

export default function NoticeListComponent({
                                                notices,
                                                isLoading,
                                                isError,
                                                page,
                                                size,
                                                totalElements,
                                                setPage,
                                            }: Props) {
    const navigate = useNavigate();

    const totalPages = Math.ceil(
        (Number.isFinite(totalElements) && totalElements >= 0 ? totalElements : 0) /
        (Number.isFinite(size) && size > 0 ? size : 1)
    );

    const onPageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;
        setPage(newPage);
    };

    if (isLoading)
        return <LoadingComponent isLoading />;
    if (isError || !notices)
        return <div className="p-4 text-red-500">공지 목록 불러오기 실패</div>;

    return (
        <div>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            #
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            제목
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            등록일
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {notices.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
                                등록된 공지사항이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        notices.map((n) => (
                            <tr
                                key={n.noticeId}
                                className="hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => navigate(`/admin/notices/${n.noticeId}`)}
                            >
                                <td className="px-6 py-4">{n.noticeId}</td>
                                <td className="px-4 py-2">{n.title}</td>
                                <td className="px-4 py-2">
                                    {n.regDate.slice(0, 10).replace(/-/g, ".")}
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}