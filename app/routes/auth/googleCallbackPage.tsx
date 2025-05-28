import {GoogleLoginHandler} from "~/api/googleAPI";
import {SignupProvider} from "~/contexts/signupContext";


function GoogleCallbackPage() {
    return (
        <SignupProvider>
            <GoogleLoginHandler />
        </SignupProvider>
    );
}

export default GoogleCallbackPage;