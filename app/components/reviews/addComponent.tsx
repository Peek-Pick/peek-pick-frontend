import { useRef, useState, useMemo, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { addReview } from "~/api/reviews/reviewAPI";
import { useNavigate } from "react-router-dom";
import type { TagDTO } from "~/types/tag";
import type { ProductDetailDTO } from "~/types/products";

interface AddProps {
    tags?: TagDTO[];
    product?: ProductDetailDTO;
    isLoading: boolean;
    isError: boolean;
}

export default function AddComponent({ tags, product, isLoading, isError }: AddProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [score, setScore] = useState(0);
    const [selectedTags, setSelectedTags] = useState<number[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const navigate = useNavigate();

    // tags를 category별로 그룹핑 (useMemo)
    const groupedTags = useMemo(() => {
        if (!tags) return {};
        return tags.reduce((acc, tag) => {
            if (!acc[tag.category]) acc[tag.category] = [];
            acc[tag.category].push(tag);
            return acc;
        }, {} as Record<string, TagDTO[]>);
    }, [tags]);

    const addMutation = useMutation({
        mutationFn: (formData: FormData) => addReview(formData),
        onSuccess: () => {
            navigate("/reviews/user");
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const fileArray = Array.from(files);
        setImages(prev => [...prev, ...fileArray]);
    };

    const removeImage = (idx: number) =>
        setImages(prev => prev.filter((_, i) => i !== idx));

    const toggleTag = (tagId: number) =>
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
        );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // 1) 리뷰 데이터(JSON)만 객체로 추출
        const review: ReviewAddDTO = {
            productId: product!.product_id,
            score: Number(formRef.current?.score.value),
            comment: formRef.current?.comment.value,
            tagIdList: selectedTags,
        };

        console.log(JSON.stringify(review));

        // 2) FormData 직접 생성
        const formData = new FormData();
        formData.append(
            "review",
            new Blob([JSON.stringify(review)], { type: "application/json" })
        );

        // 3) 이미지 파일들(files) append
        images.forEach(file => {
            formData.append("files", file);
        });

        // 4) 전송
        addMutation.mutate(formData);
    };

    if (isLoading)
        return <p className="text-center p-4 text-base sm:text-lg">로딩 중입니다</p>;
    if (isError)
        return<p className="text-center p-4 text-red-500 text-base sm:text-lg">상품 정보를 불러오지 못했습니다</p>

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4 flex flex-col items-center">
            <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl bg-white shadow-md rounded-lg space-y-6 p-10">
                {/* 상품 이미지 + 정보 */}
                <div className="flex flex-col items-center">
                    <img
                        src={product?.img_url || "/example.jpg"}
                        alt={product?.name || "상품 이미지"}
                        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-lg object-cover"
                    />
                    <p className="mt-2 text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                        {product?.name}
                    </p>
                </div>

                {/* 별점 선택 */}
                <div className="text-center">
                    <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                        상품은 어떠셨나요?
                    </p>
                    <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <button
                                key={i}
                                onClick={() => setScore(i)}
                                className={`transition-colors ${
                                    i <= score ? "text-yellow-400" : "text-gray-300"
                                } text-2xl sm:text-3xl md:text-4xl`}
                                aria-label={`${i}점`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                {/* 별점 선택 후 리뷰 폼 노출 */}
                {score > 0 && (
                    <form
                        ref={formRef}
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="space-y-6"
                    >
                        {/* 점수 숨김필드 */}
                        <input type="hidden" name="score" value={score} />

                        {/* 코멘트 */}
                        <textarea
                            name="comment"
                            rows={8}
                            required
                            placeholder="솔직한 상품 리뷰를 남겨주세요"
                            className="w-full border border-gray-300 rounded-md p-3 text-base sm:text-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                        />

                        {/* 카테고리별 태그 */}
                        <div>
                            <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">태그 선택</p>
                            {Object.entries(groupedTags).map(([category, tagList]) => (
                                <div key={category} className="mb-4">
                                    <p className="text-sm sm:text-base font-semibold text-gray-600 mb-3">
                                        {category}
                                    </p>
                                    <div
                                        className="flex space-x-2 overflow-x-auto px-1"
                                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                    >
                                        {tagList.map(tag => (
                                            <button
                                                key={tag.tag_id}
                                                type="button"
                                                onClick={() => toggleTag(tag.tag_id)}
                                                className={`px-3 py-1 rounded-full text-sm sm:text-base border transition-colors ${
                                                    selectedTags.includes(tag.tag_id)
                                                        ? "bg-gray-200 text-gray-700 border-gray-400"
                                                        : "bg-white text-gray-600 border-gray-300"
                                                }`}
                                            >
                                                {tag.tag_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* 이미지 업로드 */}
                        <div>
                            <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                                사진 추가
                            </p>
                            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                                {/* 업로드 버튼 */}
                                <label className="w-24 h-24 sm:w-24 sm:h-24 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center border-2 border-dashed rounded-md text-gray-400 cursor-pointer">
                                    <span className="text-2xl ">+</span>
                                    <input
                                        type="file"
                                        name="files"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                                {/* 미리보기 */}
                                {images.map((img, idx) => (
                                    <div
                                        key={idx} 
                                        className="relative w-24 h-24 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-md overflow-hidden border flex-shrink-0"
                                    >
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt={`preview-${idx}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 제출 버튼 */}
                        <button
                            type="submit"
                            disabled={addMutation.isPending}
                            className="w-full py-3 bg-black text-white font-semibold rounded-md transition-colors hover:bg-gray-800 disabled:opacity-50 text-sm sm:text-base"
                        >
                            {addMutation.isPending ? "등록 중..." : "리뷰 등록하기"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}