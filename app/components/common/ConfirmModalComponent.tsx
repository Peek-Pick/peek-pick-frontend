interface ConfirmModalProps {
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModalComponent({
                                                  message,
                                                  confirmText = "Yes",
                                                  cancelText = "No",
                                                  onConfirm,
                                                  onCancel,
                                              }: ConfirmModalProps) {
    return (
        <>
            <style>{`
        .modal-container {
          background-color: rgba(0, 0, 0, 0.5);
        }
        .modal-content {
          width: 90%;
          max-width: 500px;
          padding: 3rem 2rem;
          border-radius: 1rem;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          background: white;
          text-align: center;
          position: relative;
        }
        .modal-message {
         font-weight: 600;
         color: #2d3748;
         line-height: 2;
         font-size: 1.5rem;
         white-space: pre-line;
       }
        .modal-buttons {
          margin-top: 2rem;
          display: flex;
          gap: 1rem;
        }
        .modal-button {
          flex: 1;
          padding: 1rem 0;
          border-radius: 0.75rem;
          font-weight: 700;
          font-size: 1.25rem;
          cursor: pointer;
          border: none;
          transition: background-color 0.2s;
        }
        .confirm-button {
          background-color: #10b981;
          color: white;
        }
        .confirm-button:hover {
          background-color: #059669;
        }
        .cancel-button {
          background-color: #ef4444;
          color: white;
        }
        .cancel-button:hover {
          background-color: #dc2626;
        }

        @media (orientation: portrait) {
          .modal-content {
            max-width: 95vw;
            padding: 2.5rem 1.5rem;
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

            <div className="fixed inset-0 z-50 flex items-center justify-center modal-container" onClick={onCancel}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <p className="modal-message">{message}</p>
                    <div className="modal-buttons">
                        <button onClick={onConfirm} className="modal-button confirm-button">
                            {confirmText}
                        </button>
                        <button onClick={onCancel} className="modal-button cancel-button">
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}