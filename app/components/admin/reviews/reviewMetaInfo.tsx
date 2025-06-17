import { Eye, EyeOff } from "lucide-react";

export interface AdminReviewMetaProps {
    title: string;
    reviewId: number;
    productId:number;
    productName: string;
    recommendCnt: number;
    reportCnt: number;
    isHidden: boolean;
    regDate: string;
    modDate: string;
    onToggleHidden: () => void;
}

const ReviewMetaInfo = ({title, reviewId, productId, productName, recommendCnt,
                            reportCnt, isHidden, regDate, modDate, onToggleHidden }: AdminReviewMetaProps) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 my-6">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-700 dark:text-white">{title}</h2>
            </div>

            {/* 리뷰 관련 정보 */}
            <div className="flex flex-col">
                {[
                    {label: "Review Id", value: reviewId},
                    {label: "Product Id", value: productId},
                    {label: "Product Name", value: productName},
                    {label: "Recommend Count", value: recommendCnt},
                    {label: "Registered Date", value: regDate},
                    {label: "Modified Date", value: modDate},
                    {label: "Report Count", value: reportCnt},
                ].map((item, index) => (
                    <div className="flex items-center mb-4" key={index}>
                        <p className="text-md font-bold text-gray-700 dark:text-white mr-2">{item.label}:</p>
                        <p className="text-md text-gray-500">{item.value}</p>
                    </div>
                ))}
            </div>

            {/* isHidden 커스텀 항목 */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <p className="text-md font-bold text-gray-700 dark:text-white mr-2">Is Hidden:</p>
                    <p className={`px-2.5 py-0.5 text-sm rounded-full ${
                        isHidden
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                    >
                        {isHidden ? "숨김" : "표시"}
                    </p>
                </div>
                <button
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={isHidden ? "숨김 해제" : "숨기기"}
                    onClick={onToggleHidden}
                >
                    {isHidden ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    );
}

export default ReviewMetaInfo;