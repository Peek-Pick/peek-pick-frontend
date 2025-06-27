import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-70 h-70">
                <DotLottieReact
                    src="/loading/lottie_points.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export default Loading;
