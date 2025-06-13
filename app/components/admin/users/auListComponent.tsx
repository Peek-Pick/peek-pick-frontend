import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusChangeModal from "./statusChangeModal";
import type { UsersListDTO } from "~/types/users";
import { useUserStatusUpdater } from "~/hooks/users/useUserStatusUpdater";
import { useQueryClient } from "@tanstack/react-query";
import LoadingComponent from "~/components/common/loadingComponent";

interface UsersListProps {
    users: UsersListDTO[];
    isLoading?: boolean;
    isError?: boolean;
    page: number;
    category?: string;
    keyword?: string;
    userStatus?: string
    social?: boolean
}

export default function AuListComponent({ users, isLoading, isError, page, category, keyword, userStatus, social }: UsersListProps) {
    const navigate = useNavigate();
    const [userList, setUserList] = useState(users);

    const { updateStatus, loading, error } = useUserStatusUpdater();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const queryClient = useQueryClient();

    useEffect(() => {
        setUserList(users);
    }, [users]);

    const goDetail = (uid: number) => {
        const from = `from=userList&page=${page}&keyword=${keyword}&category=${category}&status=${userStatus}&social=${social}`;
        navigate(`/admin/users/${uid}?${from}`);
    };

    const openModal = (userId: number) => {
        setSelectedUserId(userId);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedUserId(null);
    };

    const handleStatusChange = async (status: "ACTIVE" | "DELETED" | "BANNED", banUntil?: string) => {
        if (selectedUserId === null) return;

        const result = await updateStatus({
            userId: selectedUserId,
            updateStatus: {
                status,
                banUntil,
            },
        });

        if (result) {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ["adminUserList"], exact: false }),
            ]);
            closeModal();
        }
    };

    if (isLoading)
        return <LoadingComponent isLoading />;
    if (isError || !userList)
        return <div className="p-4 text-red-500">유저 목록 불러오기 실패</div>;

    return (
        <div>
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
                        {userList.length === 0 ? (
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

                {modalOpen && selectedUserId !== null && (
                    <StatusChangeModal
                        isOpen={modalOpen}
                        onClose={closeModal}
                        userId={selectedUserId!}
                        onSubmit={handleStatusChange}
                        loading={loading}
                        error={error}
                    />
                )}
            </div>
        </div>
    );
}
