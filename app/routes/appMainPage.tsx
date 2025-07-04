import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthContext } from "~/hooks/auth/useAuthContext";
import BottomNavComponent from "~/components/main/bottomNavComponent";
import CarouselComponent from "~/components/main/carouselComponent";
import MenuGrid from "~/components/main/menuGridComponent";
import { RankingComponent } from "~/components/main/RankingComponent";
import { RecommendComponent } from "~/components/main/RecommendComponent";
import RecommendSkeleton from "~/components/main/RecommendSkeleton";
import { MainLoading } from "~/util/loading/mainLoading";
import { usePushPermissionModal } from "~/hooks/push/usePushPermissionModal";
import {getFCMTokenValidity} from "~/api/push/pushAPI";
import {requestAndSaveToken} from "~/hooks/push/useFCM";

function AppMainPage() {
    const [showLoading, setShowLoading] = useState(true);
    const { isLoggedIn, isLoading: checkingLogged } = useAuthContext();
    const { openModal, ChangePermissionModal } = usePushPermissionModal();

    useEffect(() => {
        if (checkingLogged) return;

        const hasVisited = sessionStorage.getItem("hasVisitedMain");
        if (!hasVisited) {
            sessionStorage.setItem("hasVisitedMain", "true");

            if (isLoggedIn && Notification.permission !== "granted") {
                openModal(); // 첫 방문 시 모달 오픈
            }

            const timer = setTimeout(() => setShowLoading(false), 3000);
            return () => clearTimeout(timer);
        } else {
            setShowLoading(false);
        }
    }, [checkingLogged, isLoggedIn]);

    useEffect(() => {
        if (!isLoggedIn) return;

        const storedToken = localStorage.getItem("fcmToken");
        if (!storedToken) {
            console.log("[FCM] 저장된 토큰 없음, 새 토큰 생성 시도");

            // 새 토큰 요청 및 저장 시도
            requestAndSaveToken()
                .then((token) => {
                    if (token) {
                        localStorage.setItem("fcmToken", token);
                        console.log("[FCM] 새 토큰 발급 및 저장 완료:", token);
                    } else {
                        console.log("[FCM] 새 토큰 발급 실패");
                    }
                })
                .catch((err) => {
                    console.error("[FCM] 새 토큰 요청 중 오류:", err);
                });
            return;
        }

        // 기존 토큰 유효성 검증 로직
        getFCMTokenValidity(storedToken)
            .then((isValid) => {
                if (!isValid) {
                    console.log("[FCM] 토큰이 유효하지 않음");
                    // 유효하지 않을 경우 토큰 재발급 등 별도 처리 원하면 여기 추가
                } else {
                    console.log("[FCM] 토큰 유효 확인 완료");
                }
            })
            .catch((err) => {
                console.error("[FCM] 토큰 유효성 검증 중 오류:", err);
            });
    }, [isLoggedIn]);

    if (showLoading) return <MainLoading />;

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow relative space-y-4">
            <CarouselComponent />
            <MenuGrid />

            {checkingLogged ? (
                <>
                    <RecommendSkeleton msg={"Top Ranking"} />
                    <RecommendSkeleton msg={"Top Picks for you"} />
                </>
            ) : isLoggedIn ? (
                <>
                    <RankingComponent />
                    <RecommendComponent />
                </>
            ) : (
                <>
                    <RecommendSkeleton msg={"Top Ranking"} />
                    <RecommendSkeleton msg={"Top Picks for you"} />
                </>
            )}

            <ChangePermissionModal />
            <BottomNavComponent />
        </div>
    );
}

export default AppMainPage;