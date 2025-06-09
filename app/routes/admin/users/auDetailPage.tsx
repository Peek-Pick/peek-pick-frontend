import AuDetailComponent from "~/components/admin/users/auDetailComponent";
import {useQuery} from "@tanstack/react-query";
import type {UsersDetailDTO} from "~/types/users";
import {getUserDetail} from "~/api/users/adminUsersAPI";
import {useParams} from "react-router";

function AuDetailPage() {

    // 유저 프로필 받아오기
    const { uid } = useParams<{ uid: string }>();

    const userId = Number(uid)

    const { data: userData, isError:userError, isLoading:userLoading } = useQuery<UsersDetailDTO>({
        queryKey: ["adminUserProfile", userId],
        queryFn: () => getUserDetail(userId),
        enabled:  userId !== null,
    });


    if (userLoading) return <div className="p-4 text-gray-600">Loading...</div>;
    if (userError || !userData) return <div className="p-4 text-red-500">An error occurred</div>;

    return (
        <div>
            <AuDetailComponent users={userData}
                               userId={userId}
            />
        </div>
    );
}

export default AuDetailPage;