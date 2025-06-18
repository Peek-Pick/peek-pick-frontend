import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ProductLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-50 h-50">
                <DotLottieReact
                    src="https://lottie.host/40aec2c7-a807-410f-a0dc-c531fe04a29d/MVTCTeeDzJ.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

const ProductInfiniteLoading = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="https://lottie.host/776ada1b-9d7c-4020-99dd-43090299762e/s6BYfApDSU.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export {ProductLoading, ProductInfiniteLoading};