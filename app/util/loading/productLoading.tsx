import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ProductLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="https://lottie.host/613abace-f8e5-4adf-8d99-6942b7ed7ed8/00d8NGigpl.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

const ProductInfiniteLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="https://lottie.host/613abace-f8e5-4adf-8d99-6942b7ed7ed8/00d8NGigpl.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export {ProductLoading, ProductInfiniteLoading};