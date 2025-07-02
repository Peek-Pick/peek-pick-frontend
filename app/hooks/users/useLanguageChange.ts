import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import '~/util/swal/customReportSwal.css';
import { useState } from "react";
import { useTranslation } from "react-i18next";

export enum Language {
    en = "en",
    ko = "ko",
    ja = "ja",
}

export function useLanguageChange() {
    const { i18n, t } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<Language | "">("");

    const languageLabels: Record<Language, string> = {
        [Language.ko]: "한국어 (KR)",
        [Language.ja]: "日本語 (JP)",
        [Language.en]: "English (US)",
    };

    const changeMutation = useMutation({
        mutationFn: async () => {
            await i18n.changeLanguage(selectedLanguage || "en");
        },
        onSuccess: () => {
            Swal.fire({
                title: t('languageSelectGuide'),
                text: t("languageChangeSuccess"),
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: 'custom-popup',
                    title: 'custom-title',
                    actions: 'custom-actions',
                    confirmButton: 'custom-confirm-button',
                },
            });
        }
    });

    const openLanguageModal = async () => {
        const inputOptions = Object.entries(languageLabels).reduce<Record<string, string>>((acc, [key, label]) => {
            acc[key] = label;
            return acc;
        }, {});

        const { value: selected } = await Swal.fire({
            title: t("languageSelectGuide"),
            input: "radio",
            inputOptions,
            inputValidator: (v) => v ? null : t("selectLanguageConfirm"),
            showCancelButton: true,
            confirmButtonText: t("confirmOKButtonText"),
            cancelButtonText: t("cancelButtonText"),
            customClass: {
                popup: 'custom-popup',
                title: 'custom-title',
                actions: 'custom-actions',
                confirmButton: 'custom-confirm-button',
                cancelButton: 'custom-cancel-button',
            },
            buttonsStyling: false,
        });

        if (selected) {
            setSelectedLanguage(selected as Language);
            changeMutation.mutate();
        }
    };

    return { openLanguageModal };
}