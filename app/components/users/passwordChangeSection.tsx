
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
    if (isSocial) {
        return <p className="text-sm text-gray-500">
            Password changes are not available for social accounts.
        </p>;
    }

    return (
        <>
            <div>
                <label className="text-sm font-medium text-gray-600">Current Password</label>
                <input
                    type="password"
                    placeholder="Enter current password"
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
                        Verify current password &gt;
                    </button>
                    {checkStatus === "success" && (
                        <p className="text-sm text-emerald-600">Verified successfully!</p>
                    )}
                    {checkStatus === "fail" && error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-gray-600">New Password</label>
                <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full border rounded px-4 py-2"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>

            <div>
                <label className="text-sm font-medium text-gray-600">Confirm New Password</label>
                <input
                    type="password"
                    placeholder="Re-enter new password"
                    className="w-full border rounded px-4 py-2"
                    value={confirmPassword}
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                />
            </div>
        </>
    );
}