import AuDetailHeaderComponent from "~/components/admin/users/auDetailHeaderComponent";
import LoadingComponent from "~/components/common/loadingComponent";
import InquiryMetaInfo from "~/components/admin/inquiries/inquiryMetaInfo";
import InquiryDetailInfo from "~/components/admin/inquiries/inquiryDetailInfo";
import {useNavigate} from "react-router-dom";
import {useDeleteAdminInquiry} from "~/hooks/inquiries/useInquiryMutation";

export interface AdminInquiryDetailProps {
    data?: InquiryResponseDTO;
    isLoading?: boolean;
    isError?: boolean;
}

function DetailComponent({ data, isLoading, isError }: AdminInquiryDetailProps) {
    const navigate = useNavigate();
    const deleteAdminInquiryMutation = useDeleteAdminInquiry();

    // 문의 삭제 핸들러
    const handleDelete = async () => {
        const confirmed = window.confirm("정말 이 리뷰를 삭제하시겠습니까?");
        if (!confirmed) return;

        try {
            await deleteAdminInquiryMutation.mutateAsync(data.inquiryId);

            alert("삭제가 완료되었습니다.");
            navigate(`/admin/inquiries/list`);
        } catch (error) {
            alert("삭제 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    if (isLoading)
        return <LoadingComponent isLoading />;
    if (isError || !data)
        return <div className="p-4 text-red-500">문의 정보 불러오기 실패</div>;

    return (
        <div>
            <div className="flex flex-col min-h-screen px-4 py-6 bg-white dark:bg-gray-900">
                {/* 상단 사용자 정보 */}
                <AuDetailHeaderComponent
                    backgroundProfile="/BackgroundCard1.png"
                    avatarImage={data.userProfileImgUrl ?? ''}
                    name={data.userNickname}
                    email={data.userEmail}
                />

                {/* 문의 메타 정보 + 문의 내용 가로 배치 */}
                <div className="flex flex-col xl:flex-row gap-6 flex-grow mt-6">
                    <div className="w-full xl:w-1/2">
                        <InquiryMetaInfo data={data} />
                    </div>
                    <div className="w-full xl:w-1/2">
                        <InquiryDetailInfo data={data} />
                    </div>
                </div>

                {/* 하단 버튼 영역 */}
                <div className="flex flex-wrap justify-end gap-2 mt-6">
                    {/* 삭제 버튼 */}
                    <button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-700 text-white py-1.5 px-4 rounded-lg"
                    >
                        문의 삭제
                    </button>
                    {/* 목록으로 버튼 */}
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1.5 px-4 rounded-lg"
                    >
                        목록으로
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DetailComponent;