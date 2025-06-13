import { useState } from "react";

interface UserStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
    onSubmit: (status: "ACTIVE" | "DELETED" | "BANNED", banUntil?: string) => void;
    error?: string;
    loading: boolean;
}

export default function StatusChangeModal({
    isOpen,
    onClose,
    userId,
    onSubmit,
    error,
    loading
}: UserStatusModalProps) {
    const [newStatus, setNewStatus] = useState<"ACTIVE" | "DELETED" | "BANNED">("ACTIVE");
    const [banDays, setBanDays] = useState<3 | 7 | 15>(3); // 기본 3일

    const handleSubmit = () => {
        let banUntil;
        if (newStatus === "BANNED") {
            const date = new Date();
            date.setDate(date.getDate() + banDays);
            banUntil = date.toISOString().split("T")[0]; // yyyy-mm-dd
        }

        onSubmit(newStatus, banUntil);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
            style={{ backgroundColor: "rgba(169, 169, 169, 0.7)" }}
        >
            <div className="bg-white rounded p-6 w-[90%] max-w-md shadow-lg relative">
                <h2 className="text-lg font-semibold">사용자 상태 변경</h2>
                <div className="mt-4 space-y-3">
                    <select
                        className="w-full border rounded p-2"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as "ACTIVE" | "DELETED" | "BANNED")}
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DELETED">DELETED</option>
                        <option value="BANNED">BANNED</option>
                    </select>

                    {newStatus === "BANNED" && (
                        <div className="flex gap-2">
                            {[3, 7, 15].map((days) => (
                                <button
                                    key={days}
                                    onClick={() => setBanDays(days as 3 | 7 | 15)}
                                    className={`px-3 py-1 rounded border ${
                                        banDays === days
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    {days}일
                                </button>
                            ))}
                        </div>
                    )}

                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
                        onClick={onClose}
                        disabled={loading}
                    >
                        취소
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "변경 중..." : "변경"}
                    </button>
                </div>
            </div>
        </div>
    );
}
