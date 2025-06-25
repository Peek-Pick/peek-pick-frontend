import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface LoadingComponentProps {
    isLoading:boolean
}

export default function LoadingComponent({ isLoading } :LoadingComponentProps ) {
    if (!isLoading) return null;

    return (
        <div className="z-50 fixed inset-0 flex items-center justify-center"
             style={{ backgroundColor: "rgba(169, 169, 169, 0.7)" }}>
                <div className="w-50 h-50">
                    <DotLottieReact
                        src="/loading/lottie_common.lottie"
                        autoplay
                        loop
                    />
            </div>
        </div>
    );
}