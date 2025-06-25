import { motion } from "framer-motion";

interface ImageModalProps {
    src: string;
    alt?: string;
    onClose: () => void;
}

function ImageModalComponent({ src, alt = "이미지", onClose }: ImageModalProps) {
    return (
        <motion.div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: "rgba(169, 169, 169, 0.7)" }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="relative"
                onClick={(e) => e.stopPropagation()}
                initial={{ y: -150, opacity: 0, scale: 0.5, rotate: -15 }}
                animate={{ y: 0, opacity: 1, scale: 1, rotate: 0 }}
                exit={{ y: 150, opacity: 0, scale: 0.5, rotate: 15 }}
                transition={{ type: "spring", stiffness: 1500, damping: 15 }}
            >
                <img
                    className="max-w-full max-h-screen rounded-lg shadow-lg"
                    src={src}
                    alt={alt}
                />
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-white bg-gray-500 bg-opacity-50 p-1 px-2.5 rounded-full hover:bg-opacity-75 transition"
                >
                    ✕
                </button>
            </motion.div>
        </motion.div>
    );
}

export default ImageModalComponent;