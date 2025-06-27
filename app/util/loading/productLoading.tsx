import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ProductLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-50 h-50">
                <DotLottieReact
                    src="/loading/lottie_product.lottie"
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
                    src="/loading/lottie_product_infinite.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export {ProductLoading, ProductInfiniteLoading};