import { FaExclamationTriangle } from "react-icons/fa";

interface ModalProps {
    message: string;
    onClose: () => void;
}

export default function ModalComponent({ message, onClose }: ModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "transparent" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl text-center relative"
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "90%",
                    maxWidth: "500px",
                    padding: "2rem 1.5rem",
                }}
            >
                {/* 메시지 */}
                <p className="text-base sm:text-lg text-gray-800 font-medium leading-relaxed">{message}</p>

                {/* 닫기 버튼 */}
                <button
                    onClick={onClose}
                    className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-base"
                >
                    확인
                </button>
            </div>
        </div>
    );
}