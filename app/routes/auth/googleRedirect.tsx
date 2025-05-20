import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import {sendAuthCodeToServer} from "~/api/googleAPI";

function GoogleRedirect() {

    const [searchParams] = useSearchParams()

    const authCode = searchParams.get('code')

    useEffect(() => {
        if(authCode) {
            sendAuthCodeToServer(authCode).then(data => {
                const accessToken = data
                console.log("accessToken: ", accessToken)
                //
                // getMemberWithAccessToken(accessToken).then(loginResult => {
                //     console.log(loginResult)
                // })
            })
        }
    }, [authCode])

    if(!authCode) {
        return (<div>로그인 실패</div>)
    }

    return (
        <div>
            <div>이 페이지는 구글에서 호출해 주는 페이지 입니다</div>
            <div>{authCode}</div>
        </div>
    );
}

export default GoogleRedirect;