interface HiddenReviewOverlayProps {
    onReveal: () => void;
}

export default function HiddenOrNot({ onReveal }: HiddenReviewOverlayProps) {
    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md z-10">
            <div className="absolute inset-0 bg-yellow-100/50 backdrop-blur-md rounded-md border border-yellow-300 shadow-inner" />
            <div className="relative flex flex-col items-center text-center px-4">
                <span className="text-3xl mb-2">🙈</span>
                <p className="mb-3 text-yellow-800 font-semibold">This review is hidden!</p>
                <button
                    onClick={onReveal}
                    className="px-4 py-2 font-semibold bg-yellow-400 text-white rounded-full hover:bg-yellow-500 transition-all shadow-md"
                >
                    Show Anyway 👀
                </button>
            </div>
        </div>
    );
}