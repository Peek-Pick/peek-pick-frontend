interface ModalProps {
    message: string;
    onClose: () => void;
}

export default function ModalComponent({ message, onClose }: ModalProps) {
    return (
        <>
            <style>{`
              .modal-container {
                background-color: transparent;
              }
              .modal-content {
                width: 90%;
                max-width: 500px;
                padding: 3rem 2rem; /* padding 키움 */
                border-radius: 1rem;
                box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                background: white;
                text-align: center;
                position: relative;
              }
              .modal-message {
                 font-weight: 600;
                 color: #2d3748;
                 line-height: 2; /* 줄 간격 키움 */
                 font-size: 1.5rem; /* 글자 크기 키움 */
                 white-space: pre-line;
               }
              .modal-button {
                margin-top: 2rem; /* 위쪽 여백 키움 */
                width: 100%;
                padding: 1rem 0; /* 세로 패딩 키움 */
                background-color: #2563eb;
                color: white;
                border-radius: 0.75rem; /* 버튼 둥글기 약간 키움 */
                font-weight: 700;
                font-size: 1.25rem; /* 버튼 글자 키움 */
                transition: background-color 0.2s;
                cursor: pointer;
                border: none;
              }
              .modal-button:hover {
                background-color: #1d4ed8;
              }
            
            @media (orientation: portrait) {
              .modal-content {
                max-width: 95vw;
                padding: 2.5rem 1.5rem; /* padding 조금 줄임 */
              }
              .modal-message {
                font-size: 1.2rem;
              }
              .modal-button {
                font-size: 1rem;
                padding: 0.75rem 0;
              }
            }
            `}</style>

            <div className="fixed inset-0 z-50 flex items-center justify-center modal-container" onClick={onClose} >
                <div className="modal-content" onClick={(e) => e.stopPropagation()} >
                    <p className="modal-message">{message}</p>
                    <button onClick={onClose} className="modal-button">
                        OK
                    </button>
                </div>
            </div>
        </>
    );
}