import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ReviewLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="https://lottie.host/e9dc4c64-6c82-4081-800f-5a3602b08842/1LfA8fFX99.lottie"
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
                    src="https://lottie.host/02de7cd3-abb0-49f9-829d-434d1914ae35/3ZqxJc6xLe.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export {ReviewLoading, ReviewInfiniteLoading};