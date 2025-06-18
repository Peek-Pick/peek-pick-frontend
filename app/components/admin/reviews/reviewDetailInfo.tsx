import type {TagDTO} from "~/types/tag";

const ReviewDetailInfo = ({ title, score, comment, images, tags }: {
    title: string; score: number; comment: string; images: ReviewImgDTO[]; tags: TagDTO[]}) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-700 dark:text-white">{title}</h2>
            </div>

            <div className="flex flex-col">
                {/* 별점 */}
                <p className="text-md font-bold text-gray-700 dark:text-white mr-2 mb-2">별점</p>
                {[score,].map((item, index) => (
                    <div className="flex items-center mb-4" key={index}>
                        <p className="text-md text-gray-500">{item}</p>
                    </div>
                ))}

                {/* 커멘트 */}
                <p className="text-md font-bold text-gray-700 dark:text-white mr-2 mb-2">커멘트</p>
                {[comment,].map((item, index) => (
                    <div className="flex items-center mb-4" key={index}>
                        <p className="text-md text-gray-500">{item}</p>
                    </div>
                ))}

                {/* 리뷰 이미지 */}
                <p className="text-md font-bold text-gray-700 dark:text-white mr-2 mb-2">이미지</p>
                <div className="flex flex-wrap gap-4 mb-4">
                    {images ? (
                        images.map((img, index) => (
                            <img
                                key={index}
                                src={`http://localhost/${img.imgUrl}`}
                                alt={`리뷰 이미지 ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg shadow"
                            />
                        ))
                    ) : (
                        <p className="text-md text-gray-500">등록된 이미지가 없습니다.</p>
                    )}
                </div>

                {/* 태그 */}
                <p className="text-md font-bold text-gray-700 dark:text-white mr-2 mb-2">태그</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.length > 0 ? (
                        tags.map((tag, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium dark:bg-blue-900 dark:text-blue-100"
                            >
                                {tag.tagName}
                            </span>
                        ))
                    ) : (
                        <p className="text-md text-gray-500">등록된 태그가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewDetailInfo;