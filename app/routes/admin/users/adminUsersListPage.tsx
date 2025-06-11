import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { getUserList } from "~/api/users/adminUsersAPI";
import AuListComponent from "~/components/admin/users/auListComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import type { PagingResponse } from "~/types/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

import type { UsersListDTO } from "~/types/users";
import { useSearchParams } from "react-router-dom";
import UserFilterBar from "~/components/admin/users/auUserFilterBar";

function AdminUsersListPage() {
    const [searchParamsUrl, setSearchParamsUrl] = useSearchParams();

    // 초기값 추출
    const initialCategory = searchParamsUrl.get("category") || "all";
    const initialKeyword = searchParamsUrl.get("keyword") || "";
    const initialPage = Number(searchParamsUrl.get("page") || "0");
    const initialStatus = searchParamsUrl.get("status") || "";
    const initialSocial = searchParamsUrl.get("social") === "true";

    // 개별 상태들
    const [category, setCategory] = useState(initialCategory);
    const [keyword, setKeyword] = useState(initialKeyword);
    const [page, setPage] = useState(initialPage);
    const [userStatus, setUserStatus] = useState(initialStatus);
    const [social, setSocial] = useState(initialSocial);

    // 상태 변경 시 URL 쿼리 동기화
    useEffect(() => {
        setSearchParamsUrl({
            category,
            keyword,
            status: userStatus,
            social: social.toString(),
            page: page.toString(),
        });
    }, [category, keyword, userStatus, social, page]);

    // 검색 핸들러
    const handleSearch = () => {
        const newKeyword = category === "all" ? "" : keyword;
        setKeyword(newKeyword);
        setPage(0);
    };

    // 사용자 상태 변경
    const handleUserStatusChange = (value: string) => {
        setUserStatus(value);
        setPage(0);
    };

    // 소셜 체크 토글
    const handleSocialToggle = (value: boolean) => {
        setSocial(value);
        setPage(0);
    };

    // 쿼리 키
    const stableQueryKey = useMemo(
        () => ["adminUserList", page, category, keyword, userStatus, social],
        [page, category, keyword, userStatus, social]
    );

    // 사용자 리스트 가져오기
    const { data, isLoading, isError } = useQuery<PagingResponse<UsersListDTO>>({
        queryKey: stableQueryKey,
        queryFn: () =>
            getUserList(page, category, keyword, userStatus, social),
    });

    if (isLoading) return <div className="p-4 text-gray-600">불러오는 중...</div>;
    if (isError || !data) return <div className="p-4 text-red-500">에러 발생</div>;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUsers} /> 전체 사용자 목록
            </h3>

            {/* 필터 바 */}
            <UserFilterBar
                category={category}
                setCategory={setCategory}
                keyword={keyword}
                setKeyword={setKeyword}
                userStatus={userStatus}
                setUserStatus={handleUserStatusChange}
                social={social}
                setSocial={handleSocialToggle}
                onSearch={handleSearch}
            />

            {/* 사용자 리스트 */}
            <AuListComponent
                users={data.content}
                page={page}
                category={category}
                keyword={keyword}
                userStatus={userStatus}
                social={social}
            />

            {/* 페이지네이션 */}
            <PaginationComponent
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
                maxPageButtons={10}
            />
        </div>
    );
}

export default AdminUsersListPage;
