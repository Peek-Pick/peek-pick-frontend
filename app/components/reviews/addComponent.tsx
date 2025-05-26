import { useRef, useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { addReview } from "~/api/reviews/reviewAPI";
import { useNavigate } from "react-router-dom";

const tagOptions = ["친절해요", "깨끗해요", "추천해요", "불친절해요"];

export default function AddComponent() {
    const formRef = useRef<HTMLFormElement>(null);
    const [score, setScore] = useState(0);
    const [tags, setTags] = useState<string[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const navigate = useNavigate();

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

    const toggleTag = (tag: string) =>
        setTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // 1) 리뷰 데이터(JSON)만 객체로 추출
        const review: ReviewAddDTO = {
            score: Number(formRef.current?.score.value),
            comment: formRef.current?.comment.value,
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

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            <div className="max-w-md w-full mx-auto bg-white shadow rounded-lg space-y-6 p-6">
                {/* 상품 이미지 + 정보 */}
                <div className="flex flex-col items-center">
                    <img
                        src="/example.jpg"
                        alt="상품 이미지"
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg object-cover"
                    />
                    <p className="mt-2 font-semibold text-gray-900">바나나킥</p>
                    <p className="text-sm text-gray-500">농심</p>
                </div>

                {/* 별점 선택 */}
                <div className="text-center">
                    <p className="font-medium text-gray-700 mb-2">상품은 어떠셨나요?</p>
                    <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <button
                                key={i}
                                onClick={() => setScore(i)}
                                className={`text-3xl sm:text-4xl transition-colors ${
                                    i <= score ? "text-yellow-400" : "text-gray-300"
                                }`}
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
                        <div>
                            <textarea
                                name="comment"
                                rows={6}
                                required
                                placeholder="솔직한 상품 리뷰를 남겨주세요"
                                className="w-full border rounded-md p-3 resize-none text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                            />
                        </div>

                        {/* 태그 */}
                        <div>
                            <p className="font-medium text-gray-700 mb-1">태그 선택</p>
                            <div className="flex flex-wrap gap-2">
                                {tagOptions.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                            tags.includes(tag)
                                                ? "bg-green-100 text-green-700 border-green-400"
                                                : "text-gray-600 border-gray-300"
                                        }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                            {/* 선택된 태그를 hidden 으로 폼 전송 */}
                            {tags.map(tag => (
                                <input key={tag} type="hidden" name="tags" value={tag} />
                            ))}
                        </div>

                        {/* 이미지 업로드 */}
                        <div>
                            <p className="font-medium text-gray-700 mb-1">사진 추가</p>
                            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                                {/* 업로드 버튼 */}
                                <label className="w-22 h-22 flex-shrink-0 flex items-center justify-center border border-dashed rounded-md text-gray-400 cursor-pointer">
                                    <span className="text-2xl">+</span>
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
                                        className="relative w-22 h-22 rounded-md overflow-hidden border flex-shrink-0"
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
                            className="w-full py-3 bg-black text-white font-semibold rounded-md transition-colors hover:bg-gray-800"
                        >
                            {addMutation.isPending ? "등록 중..." : "리뷰 등록하기"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
