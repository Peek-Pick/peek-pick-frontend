interface ImageModalProps {
    src: string;
    alt?: string;
    onClose: () => void;
}

function ImageModalComponent({src, alt = "이미지",  onClose, }: ImageModalProps) {
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(169, 169, 169, 0.7)" }}
            onClick={onClose}
        >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img className="max-w-full max-h-screen rounded-lg shadow-lg"
                    src={src}
                    alt={alt} />
                <button onClick={onClose}
                    className="absolute top-2 right-2 text-white bg-gray-800 bg-opacity-50 p-1 rounded-full hover:bg-opacity-75 transition" >
                    ✕
                </button>
            </div>
        </div>
    );
}

export default ImageModalComponent;