
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="https://lottie.host/eaffb77f-346e-4197-8796-9cb9175303d8/ooKm80BdHX.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export default Loading;
