import {useEffect, useState} from "react";
import {checkEmail} from "~/api/signupAPI";


export const useEmailChecker = () => {

    const [email, setEmail] = useState("")
    const [error, setError] = useState<string|null>(null)
    const [isChecking, setIsChecking] = useState(false)
    const [isValidFormat, setIsValidFormat] = useState(false)
    const [isAvailable, setIsAvailable] = useState(false)

    // 이메일 형식 체크
    useEffect(() => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const valid = emailRegex.test(email);
        setIsValidFormat(valid);
        setIsAvailable(false); // 이메일 변경되면 초기화 필요
        setError(null);
    }, [email]);

    // 중복 확인
    const checkEmailDupl = async () => {
        if (!isValidFormat) {
            setError("It's not an email format");
            setIsAvailable(false);
            return;
        }

        try {
            setIsChecking(true);
            const { exists } = await checkEmail(email);
            if (exists) {
                setError("This email is already in use.");
                setIsAvailable(false);
            } else {
                setError(null);
                setIsAvailable(true);
            }
        } catch (err) {
            setError("Error checking email...");
            setIsAvailable(false);
        } finally {
            setIsChecking(false)
        }
    } // checkEmailDupl

    return {
        email,
        setEmail,
        checkEmailDupl,
        isValidFormat,
        isAvailable,
        isChecking,
        error,
    }

}