import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getUserList } from "~/api/users/adminUsersAPI";
import AuListComponent from "~/components/admin/users/auListComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import type { PagingResponse } from "~/types/common";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faStar, faUsers} from '@fortawesome/free-solid-svg-icons';

import type { UsersListDTO } from "~/types/users";
import {useSearchParams} from "react-router";
import UserFilterBar from "~/components/admin/users/auUserFilterBar";
import LoadingComponent from "~/components/common/loadingComponent";

function AdminUsersListPage() {

    const [searchParamsUrl, setSearchParamsUrl] = useSearchParams();

    // 초기값 설정
    const initialCategory = searchParamsUrl.get("category") || "all";
    const initialKeyword = searchParamsUrl.get("keyword") || "";
    const initialPage = Number(searchParamsUrl.get("page") || "0");
    const initialStatus = searchParamsUrl.get("userStatus") || "";
    const initialSocial = searchParamsUrl.get("social") === "true";

    // 상태 관리 (카테고리, 키워드, 페이지, userStatus, 소셜)
    const [category, setCategory] = useState(initialCategory);
    const [keyword, setKeyword] = useState(initialKeyword);
    const [inputkeyword, setInputKeyword] = useState(initialKeyword);
    const [page, setPage] = useState(initialPage)
    const [userStatus, setUserStatus] = useState(initialStatus)
    const [social, setSocial] = useState(initialSocial)

    // 뒤로가기, 앞으로가기 URL 변경 감지
    useEffect(() => {
        const newCategory = searchParamsUrl.get("category") || "all";
        const newKeyword = searchParamsUrl.get("keyword") || "";
        const newPage = Number(searchParamsUrl.get("page") || "0");
        const newUserStatus = searchParamsUrl.get("userStatus") || "";
        const newSocial = searchParamsUrl.get("social") === "true";

        setCategory(newCategory);
        setKeyword(newKeyword);
        setInputKeyword(newKeyword);
        setPage(newPage);
        setUserStatus(newUserStatus);
        setSocial(newSocial);
    }, [searchParamsUrl]);

    // userStatus 핸들러
    const handleUserStatusChange = (value: string) => {
        setUserStatus(value);
        setPage(0);
        // 💡 여기서 기존 상태를 쓰는 대신, 직접 새 값으로 반영
        setSearchParamsUrl({
            category,
            keyword,
            userStatus: value,
            social: social.toString(),
            page: "0"
        });
    };

    // social 체크박스 핸들러
    const handleSocialToggle = (value: boolean) => {
        setSocial(value)
        setSearchParamsUrl({category, keyword, userStatus, social: value.toString(), page: "0"});
        setPage(0);
    };

    // 검색 버튼 핸들링
    const handleSearch = () => {
        setKeyword(inputkeyword)
        setSearchParamsUrl({ category, keyword: inputkeyword, userStatus, social: social.toString(), page:"0" });
        setPage(0);
    };

    // 페이지 핸들링
    const handlePage = (page: number) => {
        setSearchParamsUrl({category, keyword, social: social.toString(), page: page.toString()})
        setPage(page);
    };

    // 유저 불러오기
    const { data, isLoading, isError } = useQuery<PagingResponse<UsersListDTO>>({
        queryKey: ["adminUserList", page, category, keyword, userStatus, social ],
        queryFn: () => getUserList(page, category, keyword, userStatus, social),
        // staleTime: 5 * 60 * 1000,
    });

    // console.log(data?.content)
    // console.log("QueryKey =", page, category, keyword, userStatus, social);
    console.log(userStatus)

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon
                    icon={faUsers}
                    style={{ width: '20px', height: '20px' }}
                /> 전체 사용자 목록
            </h3>
            {/* 검색 바 */}
            <UserFilterBar
                category={category} setCategory={setCategory}
                keyword={inputkeyword} setKeyword={setInputKeyword}
                userStatus={userStatus} setUserStatus={handleUserStatusChange}
                social={social} setSocial={handleSocialToggle}
                onSearch={handleSearch}
            />
            <AuListComponent
                users={data?.content}
                isLoading={isLoading}
                isError={isError}
                page={page}
                category={category}
                keyword={keyword}
                userStatus={userStatus}
                social={social}
            />
            <PaginationComponent currentPage={page}
                                 totalPages={data?.totalPages}
                                 onPageChange={handlePage}
                                 maxPageButtons={10}
            />
        </div>
    );
}

export default AdminUsersListPage;