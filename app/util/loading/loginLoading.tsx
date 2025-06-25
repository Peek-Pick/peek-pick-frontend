import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LoginLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-70 h-100">
                <DotLottieReact
                    src="/loading/lottie_login.lottie"
                    loop
                    autoplay
                    speed={1.5}
                />
            </div>
        </div>
    );
};

export {LoginLoading};