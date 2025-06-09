import { useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import type { UsersListDTO } from "~/types/users";
import {useUserStatusUpdater} from "~/hooks/users/useUserStatusUpdater";

interface UsersListProps {
    users: UsersListDTO[];
}

export default function AuListComponent({ users }: UsersListProps) {
    const navigate = useNavigate();
    const { updateStatus, loading } = useUserStatusUpdater();

    const goDetail = (uid: number) => {
        navigate(`/admin/users/${uid}`);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string>("ACTIVE");

    const openModal = (userId: number) => {
        setSelectedUserId(userId);
        setSelectedStatus("ACTIVE");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
        setSelectedStatus("ACTIVE");
    };

    const handleSubmit = async () => {
        if (selectedUserId === null) return;

        let banUntil: string | undefined;

        if (selectedStatus.startsWith("BANNED_")) {
            const days = Number(selectedStatus.split("_")[1]);
            const untilDate = new Date();
            untilDate.setDate(untilDate.getDate() + days);
            banUntil = untilDate.toISOString().split("T")[0]; // YYYY-MM-DD
        }

        await updateStatus({
            userId: selectedUserId,
            updateStatus: {
                status: selectedStatus.startsWith("BANNED") ? "BANNED" : (selectedStatus as "ACTIVE" | "DELETED"),
                banUntil,
            },
        });

        closeModal();
    };

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} /> 전체 사용자 목록
            </h3>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">email</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">type</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">status</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-3 text-center text-gray-500">
                                등록된 사용자 없음
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr
                                key={user.userId}
                                onClick={() => goDetail(user.userId)}
                                className="hover:bg-gray-100 cursor-pointer text-sm"
                            >
                                <td className="px-6 py-4">{user.userId}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.isSocial ? "Social" : "Local"}</td>
                                <td className="px-4 py-2">
                                    {user.status === "BANNED" && user.banUntil
                                        ? `BANNED (~${user.banUntil})`
                                        : user.status}
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openModal(user.userId);
                                        }}
                                        className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    >
                                        Change
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
                     style={{ backgroundColor: 'rgba(169, 169, 169, 0.7)' }}  >
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
                            <button
                                onClick={closeModal}
                                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
                            >
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
            )}
        </div>
    );
}
