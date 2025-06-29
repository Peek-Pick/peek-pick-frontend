import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const InquiryLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-30 h-30">
                <DotLottieReact
                    src="/loading/lottie_inquiry.lottie"
                    loop
                    autoplay
                    speed={2.0}
                />
            </div>
        </div>
    );
};

export {InquiryLoading};