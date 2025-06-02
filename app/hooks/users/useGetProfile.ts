import {useEffect, useState } from "react"
import { getMyPageEdit } from "~/api/myPageAPI"
import type { ProfileReadDTO } from "~/types/users"

export const useGetProfile = () => {
    
    const initData:ProfileReadDTO = {
        email: '',
        password: '',
        isSocial: false,

        nickname: '',
        gender: '',
        nationality: '',
        birthDate: '',
        profileImgUrl: '',

        tagIdList: []
    }
    
    const [data, setData] = useState<ProfileReadDTO>(initData)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string|null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profile = await getMyPageEdit()
                setData(profile)

            } catch (err) {
                console.log("프로필 불러오기 실패했지롱", err)
                setError("faild")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, []);
    console.log("훅에서 보냄", data)
    return { data, loading, error };
}