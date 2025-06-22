import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ReviewLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="/loading/lottie_review.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

const ReviewInfiniteLoading = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="/loading/lottie_review_infinte.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export {ReviewLoading, ReviewInfiniteLoading};