import { useState, useRef } from "react";

export function useLikeClick(toggleLike: (reviewId: number) => void, review: ReviewDetailDTO) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

    const handleLikeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!review.isLiked) {
            const buttonRect = e.currentTarget.getBoundingClientRect();
            const containerRect = containerRef.current?.getBoundingClientRect();

            if (buttonRect && containerRect) {
                const x = buttonRect.left - containerRect.left + buttonRect.width / 2 - 120;
                const y = buttonRect.top - containerRect.top - 240;

                setHearts((prev) => [...prev, { id: Date.now(), x, y }]);
            }
        }

        toggleLike(review.reviewId);
    };

    return {
        handleLikeClick,
        containerRef,
        hearts,
        setHearts,
    };
}