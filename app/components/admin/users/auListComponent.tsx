import { useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import type { UsersListDTO } from "~/types/users";
import {useUserStatusUpdater} from "~/hooks/users/useUserStatusUpdater";
import AuUserStatusModal from "~/components/admin/users/auUserStatusModal";

interface UsersListProps {
    users: UsersListDTO[];
}

export default function AuListComponent({ users }: UsersListProps) {
    const navigate = useNavigate();
    const { updateStatus, loading } = useUserStatusUpdater();
    const [userList, setUserList] = useState(users);

    const goDetail = (uid: number) => {
        navigate(`/admin/users/${uid}`);
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    // const [selectedStatus, setSelectedStatus] = useState<string>("ACTIVE");

    const openModal = (userId: number) => {
        setSelectedUserId(userId);
        // setSelectedStatus("ACTIVE");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUserId(null);
        // setSelectedStatus("ACTIVE");
    };

    const handleSubmit = async (selectedStatus: string) => {
        if (selectedUserId === null) return;

        let banUntil: string | undefined;
        let status: "ACTIVE" | "DELETED" | "BANNED";

        if (selectedStatus.startsWith("BANNED_")) {
            const days = Number(selectedStatus.split("_")[1]);
            const untilDate = new Date();
            untilDate.setDate(untilDate.getDate() + days);
            banUntil = untilDate.toISOString().split("T")[0];
            status = "BANNED";
        } else {
            status = selectedStatus as "ACTIVE" | "DELETED";
        }

        try {
            await updateStatus({
                userId: selectedUserId,
                updateStatus: { status, banUntil },
            });

            setUserList((prevList) =>
                prevList.map((user) =>
                    user.userId === selectedUserId
                        ? {
                            ...user,
                            status,
                            banUntil: status === "BANNED" ? banUntil : undefined,
                        }
                        : user
                )
            );
        } catch (e) {
            alert("상태 변경에 실패했습니다. 다시 시도해주세요.");
        } finally {
            closeModal();
        }
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
                        userList.map((user) => (
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
                <AuUserStatusModal isOpen={isModalOpen}
                                   onClose={closeModal}
                                   onSubmit={handleSubmit}
                                   loading={loading}
                />
            </div>

        </div>
    );
}
