import { useRef, useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteReview, modifyReview} from "~/api/reviews/reviewAPI";
import { useNavigate } from "react-router-dom";
import { useTagSelector } from "~/hooks/tags/useTagSelector";
import { Rating } from "~/components/reviews/rating/rating"
import Swal from "sweetalert2"
import '~/util/customSwal.css'

interface ModifyProps {
    review?: ReviewDetailDTO;
}

export default function ModifyComponent({ review }: ModifyProps ) {
    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();

    // 별점, 커멘트 상태관리
    const [score, setScore] = useState(review?.score ?? 0);
    const [comment, setComment] = useState(review?.comment ?? '');

    // 이미지 파일 상태관리
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewFiles, setPreviewFiles] = useState<string[]>([]);
    const [deleteImgIds, setDeleteImgIds] = useState<number[]>([]);
    const [existingImages, setExistingImages] = useState(review?.images || []);

    // 초기 태그 ID 배열
    const initialTagIds = useMemo(
        () => review?.tag_list?.map(t => t.tag_id) || [],
        [review]
    );

    // 태그 관리 hook
    const {selectedTags, toggleTag, setSelectedTags, groupedTags } = useTagSelector(initialTagIds);

    // 태그 추가 및 삭제 계산
    const { deleteTagIds, newTagIds } = useMemo(() => {
        const initSet = new Set(initialTagIds);
        const selSet = new Set(selectedTags);

        const deleteTagIds = initialTagIds.filter(id => !selSet.has(id));
        const newTagIds = selectedTags.filter(id => !initSet.has(id));

        console.log("deleteTaIds: {}, newTagIds: {}", deleteTagIds, newTagIds)
        return { deleteTagIds, newTagIds };
    }, [initialTagIds, selectedTags]);

    // 수정 리뷰 상태 관리
    useEffect(() => {
        if (review) {
            setScore(review.score);
            setComment(review.comment ?? '');
            setExistingImages(review.images || []);
            setSelectedTags(review.tag_list?.map(tag => tag.tag_id) || []);
        }
    }, [review]);

    // 새로운 이미지 추가
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        setPreviewFiles(prev => [...prev, ...files.map(file => URL.createObjectURL(file))]);
    };

    // 기존 이미지 삭제
    const handleDeleteExistingImage = (id: number) => {
        setDeleteImgIds(prev => [...prev, id]);
        setExistingImages(prev => prev.filter(img => img.img_id !== id));
    };

    // 새로운 이미지 삭제
    const handleDeleteNewImage = (idx: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
        setPreviewFiles(prev => prev.filter((_, i) => i !== idx));
    };

    // 리뷰 수정 뮤테이션
    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => modifyReview(review!.review_id, formData),
        onSuccess: () => {
            Swal.fire({
                title: "수정이 완료되었습니다",
                icon: "success",
                confirmButtonText: "확인",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            }),
                navigate(`/reviews/user`);
        },
        onError: (error) => {
            console.log(error)
            Swal.fire({
                title: "수정중 오료가 발생했습니다",
                icon: "warning",
                confirmButtonText: "확인",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            })
        },
    });

    // 수정된 리뷰 제출하기
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!review) return;

        const payload = {
            reviewId: review.review_id,
            score,
            comment,
            deleteImgIds,
            deleteTagIds,
            newTagIds
        };
        console.log(payload)

        const formData = new FormData();
        formData.append('review', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

        selectedFiles.forEach(file => formData.append('files', file));

        updateMutation.mutate(formData);
    };

    // 리뷰 삭제하기
    const handleDelete = async () => {
        if (!review) return;

        try {
            await deleteReview(review.review_id);
            Swal.fire({
                title: "삭제가 완료되었습니다",
                icon: "success",
                confirmButtonText: "확인",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            }),
            navigate(`/reviews/user`);
        } catch (error) {
            console.log(error)
            Swal.fire({
                title: "삭제중 오류가 발생했습니다",
                icon: "warning",
                confirmButtonText: "확인",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            })
        }
    };

    if (!review) return <p className="text-center text-gray-500">리뷰 정보를 불러오는 중입니다...</p>;

    return (
        <section className="py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
                {/* 제목 */}
                <h2 className="font-manrope font-bold text-4xl sm:text-4xl md:text-4xl text-center text-gray-900 mb-6">
                    Modify Review
                </h2>

                {/* 상품 이미지 + 정보 */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={review?.image_url || "/example.jpg"}
                        alt={review?.name || "상품 이미지"}
                        className="w-40 h-40 sm:w-40 sm:h-40 md:w-40 md:h-40 rounded-lg object-cover mb-"
                    />
                    <p className="text-base sm:text-base md:text-md font-semibold text-gray-800 text-center">
                        {review?.name}
                    </p>
                </div>

                {/* 별점 선택 */}
                <div className="text-center mb-8">
                    <h3 className="font-manrope font-bold text-lg sm:text-xl text-gray-800 mb-4">
                        상품은 어떠셨나요?
                    </h3>
                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <button
                                key={i}
                                onClick={() => setScore(i)}
                                className="transform transition hover:scale-110 focus:outline-none"
                                aria-label={`${i}점`}
                            >
                                <Rating filled={i <= score} />
                            </button>
                        ))}
                    </div>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                    {/* 코멘트 */}
                    <textarea
                        name="comment"
                        rows={6}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="솔직한 상품 리뷰를 남겨주세요"
                        className="w-full border border-gray-300 rounded-md p-3 text-base sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    {/* ----- 카테고리별 태그 ----- */}
                    <div>
                        <p className="font-medium text-gray-700 mb-2 text-base sm:text-base">
                            태그 선택
                        </p>
                        <div className="space-y-4">
                            {Object.entries(groupedTags).map(([category, tagList]) => (
                                <div key={category} className="w-full">
                                    {/* 카테고리 제목 */}
                                    <p className="text-sm sm:text-base font-semibold text-gray-600 mb-2">
                                        {category}
                                    </p>
                                    {/* 태그 버튼 리스트 */}
                                    <div className="flex overflow-x-auto no-scrollbar space-x-2 px-1 pb-1 -mx-1"
                                         style={{scrollbarWidth: "none", msOverflowStyle: "none"}}>
                                        {tagList.map(tag => (
                                            <button
                                                key={tag.tag_id}
                                                type="button"
                                                onClick={() => toggleTag(tag.tag_id)}
                                                className={`whitespace-nowrap px-4 py-2 text-sm font-semibold rounded-full border transition-colors
                                                    ${selectedTags.includes(tag.tag_id)
                                                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                                                    : "bg-gray-50 text-gray-600 border-gray-400"
                                                }`}
                                            >
                                                {tag.tag_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 이미지 관리 */}
                    <div>
                        <p className="text-base sm:text-base text-gray-700 mb-2">
                            사진 수정
                        </p>

                        {/* 파일 업로드 버튼 */}
                        <div className="w-full overflow-x-auto no-scrollbar flex space-x-2">
                            <label className="w-25 h-25 sm:w-25 sm:h-25 flex-shrink-0 flex items-center justify-center border-2 border-dashed rounded-md text-gray-400 cursor-pointer">
                                <span className="text-2xl">＋</span>
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
                                    className="relative w-25 h-25 sm:w-25 sm:h-25 flex-shrink-0 rounded-md overflow-hidden border"
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
                                        ×
                                    </button>
                                </div>
                            ))}

                            {/* 새 이미지 프리뷰 */}
                            {previewFiles.map((src, idx) => (
                                <div
                                    key={idx}
                                    className="relative w-25 h-25 sm:w-25 sm:h-25 flex-shrink-0 rounded-md overflow-hidden border"
                                >
                                    <img src={src} alt="추가 이미지" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteNewImage(idx)}
                                        className="absolute top-1 right-1 bg-black/50 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 삭제 수정 버튼 */}
                    <div className="flex space-x-2">
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="w-full py-3 font-semibold rounded-md text-base sm:text-base transition-colors bg-gray-400 text-white cursor-not-allowed"
                        >
                            삭제하기
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="w-full py-3 font-semibold rounded-md text-base sm:text-base transition-colors bg-emerald-400 text-white hover:bg-emerald-600"
                        >
                            리뷰 수정하기
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}