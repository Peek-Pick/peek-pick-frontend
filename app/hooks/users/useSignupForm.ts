import {useState} from "react";

export function useSignupForm() {

    // signup1
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState<string | null>(""); // null 허용

    // signup2
    const [birthDate, setBirthDate] = useState('2000-01-01')
    const [nickname, setNickname] = useState('')
    const [gender, setGender] = useState('DEFAULT')
    const [nationality, setNationality] = useState('DEFAULT')

    // signup3
    const [tags, setTags] = useState<number[]>([])

    const resetForm = () => {
        setEmail('')
        setPassword(null)
        setBirthDate('')
        setGender('')
        setNationality('')
        setNickname('')
        setTags([])
    };

    return {
        email, setEmail,
        password, setPassword,
        birthDate, setBirthDate,
        gender, setGender,
        nationality, setNationality,
        nickname, setNickname,
        tags, setTags,
        resetForm,
    }

}