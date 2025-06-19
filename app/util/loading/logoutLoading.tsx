import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ProductLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-50 h-50">
                <DotLottieReact
                    src="/loading/lottie_logout.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};