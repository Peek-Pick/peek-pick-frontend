import {createContext, useContext} from "react";
import {useSignupForm} from "~/hooks/users/useSignupForm";

const SignupContext = createContext<ReturnType<typeof useSignupForm> | null>(null);

export const SignupProvider = ({ children }: {children: React.ReactNode}) => {
    const value = useSignupForm()
    return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
}

export const useSignupContext = () => {
    const context = useContext(SignupContext)
    if (!context) throw new Error('SignupContext must be used within a SignupProvider');
    return context;
};