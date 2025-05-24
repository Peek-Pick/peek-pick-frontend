import {SignupProvider} from "~/contexts/signupContext";
import {Outlet} from "react-router-dom";

export default function SignupLayout() {

    return (
        <SignupProvider>
            <Outlet />
        </SignupProvider>
    )
}