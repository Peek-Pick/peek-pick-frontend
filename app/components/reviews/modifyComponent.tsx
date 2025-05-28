import { useRef, useState, useEffect, useMemo, type FormEvent, type ChangeEvent } from "react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteReview, modifyReview} from "~/api/reviews/reviewAPI";
import { useNavigate } from "react-router-dom";
import type { TagDTO } from "~/types/tag";

interface ModifyProps {
    review?: ReviewDetailDTO;
}

interface TagProps {
    tags?: TagDTO[];
}

export default function ModifyComponent({ review, tags }: ModifyProps & TagProps) {
    // tags를 category별로 그룹핑 (useMemo)
    const groupedTags = useMemo(() => {
        if (!tags) return {};
        return tags.reduce((acc, tag) => {
            if (!acc[tag.category]) acc[tag.category] = [];
            acc[tag.category].push(tag);
            return acc;
        }, {} as Record<string, TagDTO[]>);
    }, [tags]);

    // 초기 태그 ID 배열
    const initialTagIds = useMemo(
        () => review?.tag_list?.map(t => t.tag_id) || [],
        [review]
    );

    const formRef = useRef<HTMLFormElement>(null);
    const navigate = useNavigate();

    const [score, setScore] = useState(review?.score ?? 0);
    const [comment, setComment] = useState(review?.comment ?? '');

    const [selectedTags, setSelectedTags] = useState<number[]>(initialTagIds);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previewFiles, setPreviewFiles] = useState<string[]>([]);
    const [deleteImgIds, setDeleteImgIds] = useState<number[]>([]);
    const [existingImages, setExistingImages] = useState(review?.images || []);

    const queryClient = useQueryClient();

    // 태그 추가 및 삭제 계산
    const { deleteTagIds, newTagIds } = useMemo(() => {
        const initSet = new Set(initialTagIds);
        const selSet = new Set(selectedTags);

        const deleteTagIds = initialTagIds.filter(id => !selSet.has(id));
        const newTagIds = selectedTags.filter(id => !initSet.has(id));

        console.log("deleteTaIds: {}, newTagIds: {}", deleteTagIds, newTagIds)
        return { deleteTagIds, newTagIds };
    }, [initialTagIds, selectedTags]);

    useEffect(() => {
        if (review) {
            setScore(review.score);
            setComment(review.comment ?? '');
            setExistingImages(review.images || []);
            setSelectedTags(review.tag_list?.map(tag => tag.tag_id) || []);
        }
    }, [review]);

    const updateMutation = useMutation({
        mutationFn: (formData: FormData) => modifyReview(review!.review_id, formData),
        onSuccess: () => {
            navigate(`/reviews/user`);
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

    const handleDelete = async () => {
        if (!review) return;

        const confirmDelete = window.confirm("리뷰를 삭제하시겠습니까?");
        if (!confirmDelete) return;

        try {
            await deleteReview(review.review_id);

            navigate(`/reviews/user`);
        } catch (error) {
            alert("리뷰 삭제 중 오류가 발생했습니다.");
            console.error(error);
        }
    };

    const toggleTag = (tagId: number) =>
        setSelectedTags(prev =>
            prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
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
        <div className="w-full min-h-screen bg-gray-50 p-4 flex flex-col items-center">
            <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl bg-white shadow-md rounded-lg space-y-6 p-10">
                {/* 상품 정보 */}
                <div className="flex flex-col items-center">
                    <img
                        src={review.image_url || "/example.jpg"}
                        alt={review.name}
                        className="w-24 h-24 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-lg object-cover"
                    />
                    <div>
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                            {review.name}
                        </h2>
                    </div>
                </div>

                {/* 별점 */}
                <div className="text-center">
                    <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                        상품은 어떠셨나요?
                    </p>
                    <div className="flex justify-center space-x-1">
                        {[1,2,3,4,5].map(i => (
                            <button key={i} type="button" onClick={() => setScore(i)}
                                    className={`text-2xl sm:text-3xl md:text-4xl transition-colors ${i <= score ? 'text-yellow-400' : 'text-gray-300'}`}
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
                        className="w-full border border-gray-300 rounded-md p-3 text-base sm:text-lg resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    {/* ----- 카테고리별 태그 ----- */}
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

                    {/* 이미지 관리 */}
                    <div>
                        <p className="font-medium text-gray-700 mb-2 text-sm sm:text-base">
                            사진 수정
                        </p>
                        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar">
                            {/* 파일 업로드 버튼 */}
                            <label className="w-24 h-24 sm:w-24 sm:h-24 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center border-2 border-dashed rounded-md text-gray-400 cursor-pointer">
                                <span className="text-2xl ">+</span>
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
                                    className="relative w-24 h-24 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-md overflow-hidden border flex-shrink-0"
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
                                    className="relative w-24 h-24 sm:w-24 sm:h-24 md:w-24 md:h-24 rounded-md overflow-hidden border flex-shrink-0"
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