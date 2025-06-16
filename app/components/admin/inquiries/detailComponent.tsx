import AuDetailHeaderComponent from "~/components/admin/users/auDetailHeaderComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import InquiryMetaInfo from "~/components/admin/inquiries/inquiryMetaInfo";
import InquiryDetailInfo from "~/components/admin/inquiries/inquiryDetailInfo";
import {useNavigate} from "react-router-dom";
import {useDeleteAdminInquiry} from "~/hooks/inquiries/useInquiryMutation";
import ReplyAddInfo from "~/components/admin/inquiries/replyAddInfo";
import ReplyEditInfo from "~/components/admin/inquiries/replyEditInfo";
import {useEffect} from "react";

export interface AdminInquiryDetailProps {
    data?: InquiryResponseDTO;
    isLoading?: boolean;
    isError?: boolean;
}

function DetailComponent({ data, isLoading, isError }: AdminInquiryDetailProps) {
    const navigate = useNavigate();
    const deleteAdminInquiryMutation = useDeleteAdminInquiry();

    const handleDeleteOrRestore = async () => {
        if (!data) return;

        const isDeleted = data.isDelete;

        const confirmed = confirm(
            isDeleted
                ? "이 문의를 복구하시겠습니까?"
                : "정말 이 문의를 삭제하시겠습니까?"
        );
        if (!confirmed) return;

        try {
            if (isDeleted) {
                await deleteAdminInquiryMutation.mutateAsync(data.inquiryId);
                alert("복구가 완료되었습니다.");
            } else {
                await deleteAdminInquiryMutation.mutateAsync(data.inquiryId);
                alert("삭제가 완료되었습니다.");
            }
            navigate(0); // 현재 페이지 새로고침
        } catch (err) {
            alert(isDeleted ? "복구 중 오류가 발생했습니다." : "삭제 중 오류가 발생했습니다.");
            console.error(err);
        }
    };

    if (isLoading) return <LoadingComponent isLoading/>;
    if (isError || !data) return <div className="p-4 text-red-500">문의 정보 불러오기 실패</div>;

    return (
        <div className="flex flex-col">
            {/* 상단: 사용자 정보 */}
            <AuDetailHeaderComponent
                backgroundProfile="bg-white/80 dark:bg-gradient-to-br dark:from-white/20 dark:to-transparent"
                avatarImage={data.userProfileImgUrl}
                name={data.userNickname}
                email={data.userEmail}
            />

            {/* 문의 정보 카드 */}
            <div className="w-full mt-6">
                <InquiryMetaInfo data={data}/>
            </div>

            {/* 본문 + 답변 */}
            <div className="flex flex-col xl:flex-row gap-6 flex-grow mt-6">
                {/* 왼쪽: 제목 + 상세 본문 */}
                <div className="w-full xl:w-1/2">
                    <InquiryDetailInfo data={data} />
                </div>

                {/* 오른쪽: 답변 등록 카드 or 수정 카드 */}
                <div className="w-full xl:w-1/2 flex flex-col">
                    {data.status === "ANSWERED" ? (
                        <div>
                            <ReplyEditInfo inquiryId={data.inquiryId} onSuccess={() => navigate(0)} />
                        </div>
                    ) : (
                        <div>
                            <ReplyAddInfo inquiryId={data.inquiryId} onSuccess={() => navigate(0)} />
                        </div>
                    )}
                </div>
            </div>

            {/* 하단 버튼 */}
            <div className="flex justify-end gap-2 mt-6">
                <button
                    onClick={handleDeleteOrRestore}
                    className={`py-1.5 px-4 rounded-lg font-semibold ${
                        data.isDelete
                            ? "bg-green-500 hover:bg-green-600 text-white" // 복구 버튼
                            : "bg-red-500 hover:bg-red-600 text-white"   // 삭제 버튼
                    }`}
                >
                    {data.isDelete ? "문의 복구" : "문의 삭제"}
                </button>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1.5 px-4 rounded-lg"
                >
                    목록으로
                </button>
            </div>
        </div>
    );
}

export default DetailComponent;