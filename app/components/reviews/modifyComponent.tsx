import { useRef, useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteReview, modifyReview} from "~/api/reviews/reviewAPI";
import { useNavigate } from "react-router-dom";

interface ModifyProps {
    review?: ReviewDetailDTO;
}

const tagOptions = ["친절해요", "깨끗해요", "추천해요", "불친절해요"];

export default function ModifyComponent({ review }: ModifyProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();

    const [score, setScore] = useState(review?.score ?? 0);
    const [comment, setComment] = useState(review?.comment ?? '');
    const [tags, setTags] = useState<string[]>([]);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewFiles, setPreviewFiles] = useState<string[]>([]);
    const [deleteImgIds, setDeleteImgIds] = useState<number[]>([]);
    const [existingImages, setExistingImages] = useState(review?.images || []);

    const queryClient = useQueryClient();

    useEffect(() => {
        if (review) {
            setScore(review.score);
            setComment(review.comment ?? '');
            setExistingImages(review.images || []);
        }
    }, [review]);

    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => modifyReview(review!.review_id, formData),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({queryKey: ["review", review!.review_id.toString()]}),
                queryClient.invalidateQueries({queryKey: ["userReviewCount"]}),
                queryClient.invalidateQueries({queryKey: ["userReviews"]}),
            ]);
            navigate(`/reviews/${review!.review_id}`);
        },
        onError: (error) => {
            alert("리뷰 수정 중 오류가 발생했습니다.");
            console.error(error);
        }
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!review) return;

        const confirmDelete = window.confirm("리뷰를 수정하시겠습니까?");
        if (!confirmDelete) return;

        const payload = { reviewId: review.review_id, score, comment, deleteImgIds };
        const formData = new FormData();
        formData.append('review', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

        selectedFiles.forEach(file => formData.append('files', file));

        updateMutation.mutate(formData);
    };

    const handleDelete = async () => {
        if (!review) return;

        const confirmDelete = window.confirm("리뷰를 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            await deleteReview(review.review_id);

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["review", review.review_id.toString()] }),
                queryClient.invalidateQueries({ queryKey: ["userReviews"] }),
                queryClient.invalidateQueries({ queryKey: ["userReviewCount"] }),
            ]);

            navigate(`/reviews/user`);
        } catch (error) {
            alert("리뷰 삭제 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    const toggleTag = (tag: string) =>
        setTags(prev =>
            prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
        );

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        setPreviewFiles(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    };

    const handleDeleteExistingImage = (id: number) => {
        setDeleteImgIds(prev => [...prev, id]);
        setExistingImages(prev => prev.filter(img => img.img_id !== id));
    };

    const handleDeleteNewImage = (idx: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
        setPreviewFiles(prev => prev.filter((_, i) => i !== idx));
    };

    if (!review) return <p className="text-center text-gray-500">리뷰 정보를 불러오는 중입니다...</p>;

    return (
        <div className="w-full min-h-screen bg-gray-50 p-4">
            <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
                {/* 상품 정보 */}
                <div className="flex flex-col items-center space-y-2">
                    <img src="/example.jpg" alt="상품 이미지" className="w-24 h-24 rounded-lg object-cover" />
                    <div className="text-center">
                        <p className="font-semibold text-gray-900">바나나킥</p>
                        <p className="text-sm text-gray-500">농심</p>
                    </div>
                </div>

                {/* 별점 */}
                <div className="text-center">
                    <p className="font-medium text-gray-700 mb-1">상품은 어떠셨나요?</p>
                    <div className="flex justify-center space-x-2">
                        {[1,2,3,4,5].map(i => (
                            <button key={i} type="button" onClick={() => setScore(i)}
                                    className={`text-3xl transition-colors ${i <= score ? 'text-yellow-400' : 'text-gray-300'}`}
                                    aria-label={`${i}점`}
                            >★</button>
                        ))}
                    </div></div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {/* 코멘트 */}
                    <textarea
                        name="comment"
                        rows={6}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="솔직한 상품 리뷰를 남겨주세요"
                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    />

                    {/* 태그 선택 */}
                    <div>
                        <p className="font-medium text-gray-700 mb-1">태그 선택</p>
                        <div className="flex flex-wrap gap-2">
                            {tagOptions.map(tag => (
                                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                                        className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                                            tags.includes(tag)
                                                ? "bg-green-100 text-green-700 border-green-400"
                                                : "text-gray-600 border-gray-300"
                                        }`}
                                >{tag}</button>
                            ))}
                        </div>
                    </div>

                    {/* 이미지 관리 */}
                    <div>
                        <p className="font-medium text-gray-700 mb-1">사진 수정</p>
                        <div className="flex flex-nowrap gap-2 overflow-x-auto">
                            {/* 파일 업로드 버튼 */}
                            <label className="w-22 h-22 sm:w-22 sm:h-22 flex items-center justify-center border border-dashed rounded-md text-gray-400 cursor-pointer flex-shrink-0">
                                <span className="text-2xl">+</span>
                                <input
                                    type="file"
                                    name="files"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>

                            {/* 기존 이미지 */}
                            {existingImages.map(img => (
                                <div
                                    key={img.img_id}
                                    className="relative w-22 h-22 sm:w-22 sm:h-22 rounded-md overflow-hidden border flex-shrink-0"
                                >
                                    <img
                                        src={`http://localhost/s_${img.img_url}`}
                                        alt="기존 이미지"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteExistingImage(img.img_id)}
                                        className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}

                            {/* 새 이미지 프리뷰 */}
                            {previewFiles.map((src, idx) => (
                                <div
                                    key={idx}
                                    className="relative w-22 h-22 sm:w-22 sm:h-22 rounded-md overflow-hidden border flex-shrink-0"
                                >
                                    <img src={src} alt="추가 이미지" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteNewImage(idx)}
                                        className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-1/2 py-3 bg-red-500 text-white font-semibold rounded-md transition-colors hover:bg-red-600"
                        >
                            삭제하기
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="w-1/2 py-3 bg-black text-white font-semibold rounded-md transition-colors hover:bg-gray-800"
                        >
                            {updateMutation.isPending ? '수정 중...' : '리뷰 수정하기'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}