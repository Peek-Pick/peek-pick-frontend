import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getUserList } from "~/api/users/adminUsersAPI";
import AuListComponent from "~/components/admin/users/auListComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import type { PagingResponse } from "~/types/common";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

import type { UsersListDTO } from "~/types/users";
import {useSearchParams} from "react-router";
import UserFilterBar from "~/components/admin/users/auUserFilterBar";

function AdminUsersListPage() {

    const [searchParamsUrl] = useSearchParams();

    // 초기값 설정
    const initialCategory = searchParamsUrl.get("category") || "all";
    const initialKeyword = searchParamsUrl.get("keyword") || "";
    const initialPage = Number(searchParamsUrl.get("page") || "0");
    const initialStatus = searchParamsUrl.get("status") || "";
    const initialSocial = searchParamsUrl.get("social") === "true";

    // 필터링 타입과 키워드
    const [category, setCategory] = useState(initialCategory);
    const [keyword, setKeyword] = useState(initialKeyword);

    // 페이지 번호
    const [page, setPage] = useState(initialPage)

    // status
    const [userStatus, setUserStatus] = useState(initialStatus)

    // social 계정만 보여주기
    const [social, setSocial] = useState(initialSocial)

    // status 핸들러
    const handleUserStatusChange = (value: string) => {
        setUserStatus(value);
        const newSearchParams = {
            ...searchParams,
            userStatus: value
        };
        setSearchParams(newSearchParams);
        setPage(0);
    };

    // social 체크박스 핸들러
    const handleSocialToggle = (value: boolean) => {
        setSocial(value);
        setSearchParams(prev => ({
            ...prev,
            social: value
        }));
        setPage(0);
    };

    // 실제 쿼리 요청 r값
    const [searchParams, setSearchParams] = useState(
        {
            category: initialCategory,
            keyword: initialKeyword,
            userStatus: initialStatus,
            social: initialSocial
        }
    );

    // 검색 버튼 핸들링
    const handleSearch = () => {
        const newKeyword = category === "all" ? "" : keyword;
        setSearchParams({ category, keyword: newKeyword, userStatus, social });
        setPage(0);
    };

    const { data, isLoading, isError } = useQuery<PagingResponse<UsersListDTO>>({
        queryKey: ["adminUserList", page, searchParams ],
        queryFn: () => getUserList(page, searchParams.category, searchParams.keyword, searchParams.userStatus, searchParams.social)
    });
    

    if (isLoading) return <div className="p-4 text-gray-600">불러오는 중...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;
    
    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} /> 전체 사용자 목록
            </h3>
            {/* 검색 바 */}
            <UserFilterBar
                category={category} setCategory={setCategory}
                keyword={keyword} setKeyword={setKeyword}
                userStatus={userStatus} setUserStatus={handleUserStatusChange}
                social={social} setSocial={handleSocialToggle}
                onSearch={handleSearch}
            />
            <AuListComponent
                users={data.content}
                page={page}
                category={category}
                keyword={keyword}
                userStatus={userStatus}
                social={social}
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