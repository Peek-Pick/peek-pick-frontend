interface ModalProps {
    message: string;
    onClose: () => void;
}

export default function ModalComponent({message, onClose}: ModalProps) {
    return (
        <>
            <style>{`
        .modal-container {
          background-color: transparent;
        }
        .modal-content {
          width: 90%;
          max-width: 500px;
          padding: 2rem 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          background: white;
          text-align: center;
          position: relative;
        }
        .modal-message {
          font-weight: 600;
          color: #2d3748;
          line-height: 1.6;
          font-size: 1.125rem; /* 18px base */
        }
        .modal-button {
          margin-top: 1.5rem;
          width: 100%;
          padding: 0.75rem 0;
          background-color: #2563eb;
          color: white;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          transition: background-color 0.2s;
          cursor: pointer;
          border: none;
        }
        .modal-button:hover {
          background-color: #1d4ed8;
        }
        @media (orientation: portrait) {
          .modal-content {
            max-width: 90vw;
            padding: 3rem 2rem;
          }
          .modal-message {
            font-size: 2rem; /* 32px for portrait, 더 크게 */
          }
          .modal-button {
            font-size: 1.25rem;
            padding: 1rem 0;
          }
        }
      `}</style>

            <div className="fixed inset-0 z-50 flex items-center justify-center modal-container" onClick={onClose} >
                <div className="modal-content" onClick={(e) => e.stopPropagation()} >
                    <p className="modal-message">{message}</p>
                    <button onClick={onClose} className="modal-button">
                        확인
                    </button>
                </div>
            </div>
        </>
    );
}