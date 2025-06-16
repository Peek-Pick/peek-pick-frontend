import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ProductLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-50 h-50">
                <DotLottieReact
                    src="https://lottie.host/eca275ba-15ee-4613-a538-c09fee4c52d3/9Ll5bZmsFR.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};