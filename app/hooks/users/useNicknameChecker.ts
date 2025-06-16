import { useEffect, useState } from "react";
import {CheckNickname} from "~/api/users/signupAPI";

export function useNicknameChecker(nickname: string) {
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!nickname || nickname.length < 2 || nickname.length > 15) {
            setError("Please choose the nickname from 2 to 15 characters.");
            setIsAvailable(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsChecking(true);
            try {
            const { exists } = await CheckNickname(nickname);
            if (exists) {
                setError("This nickname is already in use.");
                setIsAvailable(false);
            } else {
                setError(null);
                setIsAvailable(true);
            }
        } catch (err) {
            setError("Error checking nickname...");
            setIsAvailable(false);
        } finally {
            setIsChecking(false)
        }
        }, 10);

        return () => clearTimeout(timer);
    }, [nickname]);

    return { isChecking, isAvailable, error };
}