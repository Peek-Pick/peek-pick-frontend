import MyPageEditComponent from "~/components/users/myPageEditComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import {useQuery} from "@tanstack/react-query";
import {getMyPageEdit} from "~/api/users/myPageAPI";
import {BackButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";

function useGetProfile ()  {
    return useQuery({
        queryKey: ['myPageEdit'],
        queryFn: getMyPageEdit,
        staleTime: 1000 * 60 * 5, // 5분 동안은 fresh
        retry: 1, // 실패 시 1회 재시도
    });
};

function MyPageEditPage() {

    const {data: profile, isLoading, isError } = useGetProfile();

    // if (isLoading) return <Loading />;
    // if (isError || !profile) return <ErrorComponent />;

    if (isLoading) return <p>로딩 중...!</p>;
    if (isError || !profile) return <p>에러 발생!</p>;

    return (
        <div>
            <MyPageEditComponent profile={profile}/>
            <BackButton />
            <FloatingActionButtons />
        </div>
    );
}

export default MyPageEditPage;