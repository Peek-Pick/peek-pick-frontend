import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import '~/util/swal/customSwal.css';
import { useState } from "react";
import { useTranslation } from "react-i18next";

export enum Language {
    EN = "en",
    KO = "ko",
    ES = "es",
    JP = "ja",
}

export function useLanguageChange() {
    const { i18n, t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<Language | "">("");

    const LanguageDescriptions: Record<Language, string> = {
        [Language.EN]: "English",
        [Language.KO]: "한국어",
        [Language.ES]: "Español",
        [Language.JP]: "日本語",
    };

    const changeMutation = useMutation({
        mutationFn: async () => {
            // 실제 서버로 언어 변경 요청이 있다면 여기에 추가
            await i18n.changeLanguage(selectedLanguage || "en");
        },
        onSuccess: () => {
            Swal.fire({
                title: t("language.successTitle"),
                text: t("language.successMessage"),
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
        },
        onError: () => {
            Swal.fire({
                title: t("language.errorTitle"),
                text: t("language.errorMessage"),
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
        },
    });

    const openChangeModal = async () => {
        const inputOptions = Object.entries(LanguageDescriptions).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

        const { value: selected } = await Swal.fire({
            title: t("language.selectTitle"),
            input: "radio",
            inputOptions,
            inputValidator: (v) => (v ? null : t("language.validation")),
            showCancelButton: true,
            confirmButtonText: t("language.confirmButton"),
            cancelButtonText: t("language.cancelButton"),
            customClass: {
                popup: "custom-popup",
                title: "custom-title",
                actions: "custom-actions",
                confirmButton: "custom-confirm-button",
                cancelButton: "custom-cancel-button",
            },
            buttonsStyling: false,
        });

        if (selected) {
            setSelectedLanguage(selected as Language);
            changeMutation.mutate();
        }
    };

    return { openChangeModal };
}
