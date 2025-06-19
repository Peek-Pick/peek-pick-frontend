import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="/loading/lottie_map.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export default Loading;
