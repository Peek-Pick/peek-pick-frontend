import {useTranslation} from "react-i18next";

type PasswordChangeSectionProps = {
    isSocial: boolean;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
    checkStatus: "idle" | "checking" | "success" | "fail";
    setCurrentPassword: (value: string) => void;
    setNewPassword: (value: string) => void;
    setConfirmPassword: (value: string) => void;
    error: string | null;
    checkCurrentPassword: () => Promise<boolean>;
    checkNewPassword: () => boolean;
}

export function PasswordChangeSection({ isSocial,
                                   currentPassword,
                                   newPassword,
                                   confirmPassword,
                                   checkStatus,
                                   setCurrentPassword,
                                   setNewPassword,
                                   setConfirmPassword,
                                   error,
                                   checkCurrentPassword,
                                   }: PasswordChangeSectionProps) {
    // 국제화 적용
    const { t } = useTranslation();

    if (isSocial) {
        return <p className="text-sm text-gray-500">
            {t('form.ifSocial')}
        </p>;
    }

    return (
        <>
            <div>
                <label className="text-sm font-medium text-gray-600">{t('form.currentPassword')}</label>
                <input
                    type="password"
                    placeholder={t('form.enterCurrentPassword')}
                    className="w-full border rounded px-4 py-2"
                    value={currentPassword}
                    onChange={ (e) => setCurrentPassword(e.target.value)}
                />
                <div className="mt-3 flex items-center gap-2">

                    <button
                        type="button"
                        onClick={checkCurrentPassword}
                        className="text-sm text-emerald-600 hover:underline"
                    >
                        {t('form.passwordCheck')} &gt;
                    </button>
                    {checkStatus === "success" && (
                        <p className="text-sm text-emerald-600"> {t('form.passwordCheckSuccess')}</p>
                    )}
                    {checkStatus === "fail" && error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-600">{t('form.newPassword')}</label>
                <input
                    type="password"
                    placeholder={t('form.enterNewPassword')}
                    className="w-full border rounded px-4 py-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-600">{t('form.checkPassword')}</label>
                <input
                    type="password"
                    placeholder={t('form.enterNewPasswordRe')}
                    className="w-full border rounded px-4 py-2"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />
            </div>
        </>
    );
}