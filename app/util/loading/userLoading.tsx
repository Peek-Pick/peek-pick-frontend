import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const UserLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <div className="w-40 h-40">
                <DotLottieReact
                    src="/loading/lottie_user_profile.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export {UserLoading};