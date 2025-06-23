import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const ErrorComponent = () => {
    return (
        // <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        {/*<div className="absolute inset-0 flex items-center justify-center bg-white z-50">*/}

            <div className="w-40 h-40">
                <DotLottieReact
                    src="/loading/lottie_error.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export {ErrorComponent};