import AverageRating from "~/components/reviews/rating/averageRating";
import {useTranslation} from "react-i18next";

interface Props {
    score: number;
    reviewCount: number;
}

export default function AverageRatingSection({ score, reviewCount }: Props) {
    // 국제화 적용
    const { t } = useTranslation();

    return (
        <div className="grid grid-cols-1 xl:grid-cols-1 pb-2 border-gray-100 w-full mb-2">
            <div className="p-6 bg-yellow-50 rounded-3xl flex items-center justify-center flex-col">
                <h2 className="font-manrope font-bold text-3xl text-amber-400 mb-2">{score}</h2>
                <AverageRating score={score} />
                <p className="font-semibold leading-4 text-gray-700 text-center">{reviewCount}{t('ratings')}</p>
            </div>
        </div>
    );
}