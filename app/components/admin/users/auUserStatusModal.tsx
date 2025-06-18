import { useState, useEffect } from "react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (selectedStatus: string) => void;
    loading: boolean;
}

export default function AuUserStatusModal({
                                              isOpen,
                                              onClose,
                                              onSubmit,
                                              loading,
                                          }: Props) {
    const [selectedStatus, setSelectedStatus] = useState<string>("ACTIVE");

    useEffect(() => {
        if (isOpen) setSelectedStatus("ACTIVE");
    }, [isOpen]);

    const handleSubmit = () => {
        onSubmit(selectedStatus); // 이제 부모가 처리함
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            style={{ backgroundColor: "rgba(169, 169, 169, 0.7)" }}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 w-[320px]">
                <h4 className="text-lg font-semibold mb-4">상태 변경</h4>
                <div className="mb-4 space-y-2">
                    {[
                        { label: "ACTIVE", value: "ACTIVE" },
                        { label: "BANNED (3일)", value: "BANNED_3" },
                        { label: "BANNED (7일)", value: "BANNED_7" },
                        { label: "BANNED (15일)", value: "BANNED_15" },
                        { label: "DELETED", value: "DELETED" },
                    ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="status"
                                value={option.value}
                                checked={selectedStatus === option.value}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="form-radio text-indigo-600"
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm">
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                        {loading ? "변경 중..." : "변경"}
                    </button>
                </div>
            </div>
        </div>
    );
}
