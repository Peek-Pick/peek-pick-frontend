import { useRef, useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { deleteReview, modifyReview} from "~/api/reviews/reviewAPI";
import { useNavigate } from "react-router-dom";
import { useTagSelector } from "~/hooks/tags/useTagSelector";
import { Rating } from "~/components/reviews/rating/rating"
import { ReviewLoading } from "~/util/loading/reviewLoading";
import TextareaAutosize from 'react-textarea-autosize';
import { BackButton } from "~/util/button/FloatingActionButtons";
import Swal from "sweetalert2"
import '~/util/swal/customSwal.css'

interface ModifyProps {
    review?: ReviewDetailDTO;
    isLoading: boolean;
    isError: boolean;
}

export default function ModifyComponent({ review, isLoading, isError }: ModifyProps ) {
    if (isLoading)
        return <ReviewLoading />;
    if (isError || !review) {
        return (
            <p className="text-center p-4 text-red-500 text-base sm:text-lg">
                Failed to load review data.
            </p>
        );
    }

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
        () => review?.tagList?.map(t => t.tagId) || [],
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

        return { deleteTagIds, newTagIds };
    }, [initialTagIds, selectedTags]);

    // 수정 리뷰 상태 관리
    useEffect(() => {
        if (review) {
            setScore(review.score);
            setComment(review.comment ?? '');
            setExistingImages(review.images || []);
            setSelectedTags(review.tagList?.map(tag => tag.tagId) || []);
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
        setExistingImages(prev => prev.filter(img => img.imgId !== id));
    };

    // 새로운 이미지 삭제
    const handleDeleteNewImage = (idx: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== idx));
        setPreviewFiles(prev => prev.filter((_, i) => i !== idx));
    };

    // 리뷰 수정 뮤테이션
    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => {
            Swal.fire({
                title: "Updating review...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            }).then();

            return modifyReview(review!.reviewId, formData);
        },
        onSuccess: () => {
            Swal.fire({
                title: "Review updated successfully",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            }).then(() => {
                navigate(`/reviews/${review.reviewId}`, { replace: true });
            });
        },
        onError: () => {
            Swal.fire({
                title: "Failed to update review",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            }).then();
        }
    });

    // 수정된 리뷰 제출하기
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!review) return;

        const commentValue = formRef.current?.comment.value?.trim();

        // 1) 코멘트 유효성 검사
        if (!commentValue) {
            Swal.fire({
                title: "Please enter your review",
                icon: "warning",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            }).then();
            return;
        }

        // 2) 리뷰 데이터(JSON)만 객체로 추출
        const payload = {
            reviewId: review.reviewId,
            score,
            comment,
            deleteImgIds,
            deleteTagIds,
            newTagIds
        };

        // 3) FormData 직접 생성
        const formData = new FormData();
        formData.append('review', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

        // 4) 이미지 파일들(files) append
        selectedFiles.forEach(file => formData.append('files', file));

        // 5) SweetAlert로 최종 확인 후 전송
        Swal.fire({
            title: "Are you sure you want to update your review?",
            text: "Once updated, the changes cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Update",
            cancelButtonText: "Cancel",
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                actions: 'custom-actions',
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                updateMutation.mutate(formData);
            }
        });
    };

    // 리뷰 삭제하기
    const handleDelete = async () => {
        const result =await Swal.fire({
            title: "Are you sure you want to delete this review?",
            text: "Once deleted, the changes cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                actions: 'custom-actions',
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            }
        });

        if (!result.isConfirmed) return;

        try {
            Swal.fire({
                title: "Deleting review...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                }
            });

            await deleteReview(review.reviewId);

            await Swal.fire({
                title: "Review deleted successfully",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
            navigate(`/reviews/user`,  { replace: true });
        } catch (error) {
            console.error(error);
            await Swal.fire({
                title: "Failed to delete review",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
        }
    };

    return (
        <section className="py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8">
                {/* 상품 이미지 + 정보 */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src={`http://localhost${review?.imageUrl}` || "/example.jpg"}
                        alt={review?.name || "Product Image"}
                        className="w-40 h-40 sm:w-40 sm:h-40 md:w-40 md:h-40 rounded-lg object-cover mb-"
                    />
                    <p className="text-base sm:text-base md:text-md font-semibold text-gray-800 text-center">
                        {review?.name}
                    </p>
                </div>

                {/* 별점 선택 */}
                <div className="text-center mb-8">
                    <h3 className="font-manrope font-bold text-lg sm:text-xl text-gray-700 mb-4">
                        How did you like the product?
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
                    <TextareaAutosize
                        name="comment"
                        minRows={6}
                        maxRows={15}
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        placeholder="Please leave an honest product review."
                        className="w-full border text-gray-600 border-gray-300 rounded-md p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    {/* ----- 카테고리별 태그 ----- */}
                    <div>
                        <p className="font-medium text-gray-800 mb-2 text-base sm:text-base">
                            Select Tags
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
                                                key={tag.tagId}
                                                type="button"
                                                onClick={() => toggleTag(tag.tagId)}
                                                className={`whitespace-nowrap px-3 py-1 text-sm sm:text-sm rounded-full border transition-colors
                                                    ${selectedTags.includes(tag.tagId)
                                                    ? "bg-emerald-50 text-emerald-500 border-emerald-200"
                                                    : "bg-gray-100 text-gray-500 border-gray-400"
                                                }`}
                                            >
                                                {tag.tagName}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 이미지 관리 */}
                    <div>
                        <p className="text-base sm:text-base text-gray-800 mb-2">
                            Edit Photo
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
                                    key={img.imgId}
                                    className="relative w-25 h-25 sm:w-25 sm:h-25 flex-shrink-0 rounded-lg overflow-hidden border border-gray-300"
                                >
                                    <img
                                        src={`http://localhost/reviews/s_${img.imgUrl}`}
                                        alt={"기존 이미지"}
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteExistingImage(img.imgId)}
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
                            className="w-full px-4 py-2 font-medium rounded-md text-sm sm:text-sm transition-colors bg-gray-400 text-white cursor-not-allowed"
                        >
                            Delete
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="w-full px-4 py-2 font-medium rounded-md text-sm sm:text-sm transition-colors bg-emerald-400 text-white hover:bg-emerald-600"
                        >
                            Edit Review
                        </button>
                    </div>
                </form>

                {/* 조이스틱 */}
                <BackButton />
            </div>
        </section>
    );
}