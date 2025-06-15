import { useQuery } from "@tanstack/react-query";
import { getMyPageEdit } from "~/api/myPageAPI";

export const useGetProfile = () => {
    return useQuery({
        queryKey: ['myProfile'],
        queryFn: getMyPageEdit,
        staleTime: 1000 * 60 * 5, // 5분 동안은 fresh
        retry: 1, // 실패 시 1회 재시도
    });
};


// import {useEffect, useState } from "react"
// import { getMyPageEdit } from "~/api/myPageAPI"
// import type { ProfileReadDTO } from "~/types/users"
//
// export const useGetProfile = () => {
//
//     const initData:ProfileReadDTO = {
//         email: '',
//         isSocial: false,
//
//         nickname: '',
//         gender: '',
//         nationality: '',
//         birthDate: '',
//         profileImgUrl: '',
//
//         tagIdList: []
//     }
//
//     const [data, setData] = useState<ProfileReadDTO>(initData)
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState<string|null>(null)
//
//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const profile = await getMyPageEdit()
//                 setData(profile)
//
//             } catch (err) {
//                 console.log("프로필 불러오기 실패했지롱", err)
//                 setError("faild")
//             } finally {
//                 setLoading(false)
//             }
//         }
//
//         fetchData()
//     }, []);
//     return { data, loading, error };
// }