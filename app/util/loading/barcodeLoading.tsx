import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const BarcodeLoading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white">
            <div className="w-150 h-100">
                <DotLottieReact
                    src="/loading/lottie_barcode.lottie"
                    loop
                    autoplay
                />
            </div>
        </div>
    );
};

export {BarcodeLoading};