import { useState } from "react";
import { useTranslation } from "react-i18next";
import { handleFCMFlow } from "~/hooks/push/useFCM";

export function usePushPermissionModal() {
    const { t } = useTranslation();

    const [visible, setVisible] = useState(false);

    const openModal = () => setVisible(true);

    const onAllowClick = async () => {
        setVisible(false);
        await handleFCMFlow(t); // t 전달 필수
    };

    const ChangePermissionModal = () => {
        if (!visible) return null;

        return (
            <div style={overlayStyle}>
                <div style={modalStyle}>
                    <h2 style={{ textAlign: "center", marginBottom: 12 }}>
                        🔔 {t("push.manageNotificationSettings", "Manage Notification Settings")}
                    </h2>
                    <p style={{ textAlign: "center", marginBottom: 16 }}>
                        {t(
                            "push.alertDescription",
                            "Get alerts about new reviews and updates. You can always change this later."
                        )}
                    </p>
                    <p style={{ fontSize: "12px", color: "#888", textAlign: "center", marginBottom: 16 }}>
                        {t("push.settingsPrefix", "Settings available under")} <strong>My Page &gt; Notifications</strong>.
                    </p>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                        <button
                            onClick={() => setVisible(false)}
                            style={cancelButtonStyle}
                        >
                            {t("cancel", "Close")}
                        </button>
                        <button
                            onClick={onAllowClick}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-lg"
                        >
                            {t("push.update", "Update")}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return { openModal, ChangePermissionModal };
}

const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
};

const modalStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "90%",
    maxWidth: 400,
    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
};

const cancelButtonStyle: React.CSSProperties = {
    backgroundColor: "#bbb",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
};
