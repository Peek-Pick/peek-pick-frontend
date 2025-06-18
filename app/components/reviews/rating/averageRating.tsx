export interface AverageRatingProps {
    score: number;
    maxStars?: number;
}

const FullStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#FBBF24">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);
const EmptyStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="#D1D5DB">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);
const HalfStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24">
        <defs>
            <linearGradient id="halfGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="50%" stopColor="#D1D5DB" />
            </linearGradient>
        </defs>
        <path fill="url(#halfGrad)"
              d="M12 17.27L18.18 21l-1.64-7.03 L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        />
    </svg>
);

const AverageRating: React.FC<AverageRatingProps> = ({ score, maxStars = 5 }) => {
    const fullStars = Math.floor(score);
    const hasHalf = score - fullStars >= 0.5;
    const emptyStars = maxStars - fullStars - (hasHalf ? 1 : 0);

    return (
        <div className="flex items-center justify-center gap-2 sm:gap-6 mb-4">
            {Array.from({ length: fullStars }).map((_, i) => (
                <FullStar key={`full-${i}`} />
            ))}
            {hasHalf && <HalfStar key="half" />}
            {Array.from({ length: emptyStars }).map((_, i) => (
                <EmptyStar key={`empty-${i}`} />
            ))}
        </div>
    );
};

export default AverageRating;