import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Index() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("/home", { replace: true });
    }, [navigate]);
    return null; // 리다이렉트 중이므로 UI 없음
}