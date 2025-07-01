import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const NoticeLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-50 h-50">
                <DotLottieReact
                    src="/loading/lottie_notice.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export {NoticeLoading};