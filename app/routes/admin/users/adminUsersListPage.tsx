import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserList } from "~/api/users/adminUsersAPI";
import AuListComponent from "~/components/admin/users/auListComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import type { PagingResponse } from "~/types/common";

import type { UsersListDTO } from "~/types/users";

function AdminUsersListPage() {

    const [page, setPage] = useState(0)
    const size = 10;

    const { data, isLoading, isError } = useQuery<PagingResponse<UsersListDTO>>({
        queryKey: [ page, size ],
        queryFn: () => getUserList(page, size)
    });
    

    if (isLoading) return <div className="p-4 text-gray-600">불러오는 중...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;
    
    return (
        <div>
            <AuListComponent
                users={data.content}
            />
            <PaginationComponent currentPage={page}
                                 totalPages={data?.totalPages}
                                 onPageChange={setPage}
                                 maxPageButtons={10}
            />
        </div>
    );
}

export default AdminUsersListPage;