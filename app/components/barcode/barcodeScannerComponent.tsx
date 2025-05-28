import { useEffect, useRef, useState } from "react";
import {
    BrowserMultiFormatReader,
    BarcodeFormat,
    DecodeHintType,
} from "@zxing/library";
import ModalComponent from "~/components/common/modalComponent";

const BarcodeScannerComponent = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [permissionError, setPermissionError] = useState<string | null>(null);

    useEffect(() => {
        const checkPermission = async () => {
            try {
                const result = await navigator.permissions.query({
                    name: "camera" as PermissionName,
                });

                const handleChange = () => {
                    if (result.state === "denied" || result.state === "prompt") {
                        setPermissionError("카메라 접근 권한이 필요합니다.");
                        // 권한 없으면 플래그 초기화 (혹시 남아있으면 제거)
                        localStorage.removeItem("reloadedAfterPermissionGranted");
                    } else if (result.state === "granted") {
                        setPermissionError(null);
                        // 이미 리로드 했는지 확인
                        const hasReloaded = localStorage.getItem(
                            "reloadedAfterPermissionGranted"
                        );
                        if (!hasReloaded) {
                            // 리로드 플래그 세팅 후 새로고침
                            localStorage.setItem(
                                "reloadedAfterPermissionGranted",
                                "true"
                            );
                            window.location.reload();
                        }
                    }
                };

                handleChange(); // 초기 상태 체크
                result.onchange = handleChange;
            } catch {
                // 권한 API 지원 안 할 경우 무시
            }
        };
        checkPermission();
    }, []);

    // ZXing reader 초기화
    useEffect(() => {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.CODE_39,
            BarcodeFormat.CODE_128,
        ]);
        readerRef.current = new BrowserMultiFormatReader(hints);
    }, []);

    // 카메라 요청
    useEffect(() => {
        (async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                setStream(s);
                if (videoRef.current) {
                    videoRef.current.srcObject = s;
                    await videoRef.current.play().catch(() => {});
                }
            } catch {
                setPermissionError("카메라 접근 권한이 필요합니다.");
            }
        })();

        return () => {
            readerRef.current?.reset();
            stream?.getTracks().forEach((t) => t.stop());
        };
    }, []);

    // 바코드 스캔
    useEffect(() => {
        if (!stream || !videoRef.current || !readerRef.current) return;

        const reader = readerRef.current;
        reader.decodeFromStream(stream, videoRef.current, (res) => {
            if (res) {
                console.log("Scanned barcode:", res.getText());     // 바코드 넘버 추후 이용
                reader.reset(); // 한 번 스캔 후 멈춤
            }
        });

        return () => reader.reset();
    }, [stream]);

    return (
        <div className="relative w-full h-full bg-black">
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
            />

            {/* 바코드 가이드 프레임: 가로 95vw, 최대 700px, 세로 180px */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="border-4 border-white border-dashed rounded-md"
                    style={{ width: '98vw', maxWidth: 800, height: 320 }}
                />
            </div>


            {/* 권한 오류 모달 */}
            {permissionError && (
                <ModalComponent
                    message={permissionError}
                    onClose={() => setPermissionError(null)}
                />
            )}
        </div>
    );
};

export default BarcodeScannerComponent;
