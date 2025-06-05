import type {TagDTO} from "~/types/tag";

export interface AdminReviewDetailProps {
    data: AdminReviewDetailDTO;
}

export default function ReadComponent({ data }: AdminReviewDetailProps) {
    return (
        <div className="bg-white shadow-md rounded-lg p-6 text-gray-800 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">리뷰 상세 정보</h2>

            {/* 유저 정보 */}
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={`http://localhost/s_${data.profileImageUrl}`}
                    alt="프로필 이미지"
                    className="w-12 h-12 rounded-full object-cover border"
                />
                <div>
                    <p className="text-lg font-semibold">{data.nickname}</p>
                    <p className="text-sm text-gray-500">User ID: {data.userId}</p>
                </div>
            </div>

            {/* 제품 및 리뷰 정보 */}
            <div className="space-y-4 mb-6">
                <InfoCard label="상품명" value={data.name} />
                <InfoCard label="제품 ID" value={data.productId.toString()} />
                <InfoCard label="평점" value={`${data.score} / 5`} />
                <InfoCard label="추천 수" value={`${data.recommendCnt}회`} />
                <InfoCard label="숨김 여부" value={data.isHidden ? "숨김" : "표시"} />
                <InfoCard label="등록일" value={new Date(data.regDate).toLocaleString()} />
                <InfoCard label="수정일" value={new Date(data.modDate).toLocaleString()} />
                <InfoCard label="코멘트" value={data.comment || "작성된 코멘트가 없습니다."} isDescription />
            </div>

            {/* 이미지 목록 */}
            {data.images.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">첨부 이미지</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.images.map((img: ReviewImgDTO) => (
                            <img
                                key={img.imgId}
                                src={`http://localhost/s_${img.imgUrl}`}
                                alt={`review-img-${img.imgId}`}
                                className="w-25 h-25 object-cover rounded-lg border"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* 태그 목록 */}
            {data.tagList.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 mb-2">태그</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.tagList.map((tag: TagDTO) => (
                            <span
                                key={tag.tagId}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full"
                            >
                                #{tag.tagName} ({tag.category})
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ✨ 재사용 가능한 카드 UI 컴포넌트
function InfoCard({
                      label,
                      value,
                      isDescription = false,
                  }: {
    label: string;
    value: string;
    isDescription?: boolean;
}) {
    return (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{label}</h3>
            <p
                className={`text-gray-900 ${isDescription ? "whitespace-pre-line leading-relaxed" : "font-medium"}`}
                style={{ fontSize: isDescription ? "0.9rem" : "1rem" }}
            >
                {value}
            </p>
        </div>
    );
}