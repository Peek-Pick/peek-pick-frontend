import type { TFunction } from 'i18next';
import { getToken } from "firebase/messaging";
import { getMessagingInstance } from "~/settingFCM";
import { getFCMToken } from "~/api/push/pushAPI";
import Swal from "sweetalert2";

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY || '';

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    try {
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        await navigator.serviceWorker.ready;
        console.log("[SW] Registered:", registration.scope);
        return registration;
    } catch (e) {
        console.error("[SW] 등록 실패:", e);
        return null;
    }
}

export async function requestAndSaveToken(): Promise<string | null> {
    const messaging = getMessagingInstance();
    if (!messaging) return null;

    const registration = await registerServiceWorker();
    if (!registration) return null;

    try {
        const token = await getToken(messaging, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration,
        });

        if (!token) return null;

        try {
            await getFCMToken(token); // 이미 등록된 경우
        } catch {
            await getFCMToken(token); // 신규 저장
            console.log("[FCM] 새 토큰 저장 완료:", token);
        }

        return token;
    } catch (err) {
        console.error("[FCM] 토큰 요청 실패:", err);
        return null;
    }
}

/**
 * 권한 체크 및 토큰 처리 통합 함수
 *
 * @param t - i18next t 함수 (국제화)
 */
export async function handleFCMFlow(t: TFunction): Promise<void> {
    const permission = Notification.permission;

    if (permission !== "denied") {
        const result = await Notification.requestPermission();
        if (result === "granted") {
            await requestAndSaveToken();
        }
        return;
    } else {
        await Swal.fire({
            icon: "info",
            title: t("push.permissionDeniedTitle", "알림 권한이 차단되어 있어요."),
            text: t("push.permissionDeniedText", "브라우저 설정에서 알림 권한을 다시 허용해주세요."),
            confirmButtonText: t("confirm", "확인"),
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                actions: 'custom-actions',
                confirmButton: 'custom-confirm-button',
            },
        });
    }
}
