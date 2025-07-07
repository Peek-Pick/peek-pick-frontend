import { useEffect, useRef, useState } from "react";
import {
    BarcodeFormat,
    BrowserMultiFormatReader,
    DecodeHintType,
} from "@zxing/library";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { nullBarcode, scanBarcode } from "~/api/barcode/barcodeAPI";
import BarcodeAddRequest from "~/components/barcode/barcodeAddRequest";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const BarcodeScannerComponent = () => {
    // 국제화
    const { t } = useTranslation();

    const videoRef = useRef<HTMLVideoElement>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);
    const navigate = useNavigate();

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [pendingBarcode, setPendingBarcode] = useState<string>("");
    const [showRequestModal, setShowRequestModal] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const data = await nullBarcode();
                // data 처리 (필요 시)
            } catch (e) {
                console.error("nullBarcode 호출 중 오류:", e);
            }
        })();
    }, []);

    async function updateServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    await registration.update();
                    console.log("[SW] 갱신");
                } else {
                    console.log("[SW] 등록된 서비스워커가 없음, 새로 등록 시도");
                    const newRegistration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
                    console.log("[SW] 새 서비스워커 등록 완료:", newRegistration.scope);
                }
            } catch (e) {
                console.error("[SW] 서비스워커 갱신/등록 실패:", e);
            }
        }
    }

    useEffect(() => {
        updateServiceWorker();
    }, []);

    // 1. 카메라 권한 체크
    useEffect(() => {
        const checkPermission = async () => {
            try {
                const result = await navigator.permissions.query({
                    name: "camera" as PermissionName,
                });

                const handleChange = async () => {
                    if (result.state === "denied" || result.state === "prompt") {
                        setPermissionError(t("barcodeScanner.cameraPermissionRequired"));
                        localStorage.removeItem("reloadedAfterPermissionGranted");

                        await Swal.fire({
                            icon: "error",
                            title: t("barcodeScanner.cameraPermissionTitle"),
                            text: t("barcodeScanner.cameraPermissionText"),
                            confirmButtonText: t("barcodeScanner.confirmButton"),
                        });
                    } else if (result.state === "granted") {
                        setPermissionError(null);
                        const hasReloaded = localStorage.getItem(
                            "reloadedAfterPermissionGranted"
                        );
                        if (!hasReloaded) {
                            localStorage.setItem("reloadedAfterPermissionGranted", "true");
                            window.location.reload();
                        }
                    }
                };

                await handleChange();
                result.onchange = handleChange;
            } catch (e) {
                console.error("Permission check failed:", e);
            }
        };
        checkPermission();
    }, [t]);

    // 2. ZXing Reader 초기화
    useEffect(() => {
        const hints = new Map();
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
            BarcodeFormat.QR_CODE,
            BarcodeFormat.DATA_MATRIX,
            BarcodeFormat.CODE_128,
            BarcodeFormat.CODABAR,
            BarcodeFormat.EAN_13,
            BarcodeFormat.EAN_8,
            BarcodeFormat.CODE_39,
            BarcodeFormat.CODE_93,
        ]);
        readerRef.current = new BrowserMultiFormatReader(hints);
    }, []);

    // 3. 카메라 켜기
    useEffect(() => {
        let localStream: MediaStream | null = null;

        (async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" },
                });
                setStream(s);
                localStream = s;

                if (videoRef.current) {
                    videoRef.current.srcObject = s;
                    await videoRef.current.play().catch(() => {});
                }
            } catch {
                setPermissionError(t("barcodeScanner.cameraPermissionRequired"));
                await Swal.fire({
                    icon: "error",
                    title: t("barcodeScanner.cameraAccessFailedTitle"),
                    text: t("barcodeScanner.cameraAccessFailedText"),
                    confirmButtonText: t("barcodeScanner.confirmButton"),
                });
            }
        })();

        return () => {
            if (readerRef.current) readerRef.current.reset();
            if (localStream) localStream.getTracks().forEach((t) => t.stop());
        };
    }, [t]);

    // 4. 바코드 인식 및 이동 처리
    useEffect(() => {
        if (!stream || !videoRef.current || !readerRef.current) return;

        const reader = readerRef.current;

        reader.decodeFromStream(stream, videoRef.current, async (result, err) => {
            if (result) {
                const barcode = result.getText();
                reader.reset();
                try {
                    const found = await scanBarcode(barcode);
                    if (found) {
                        navigate(`/products/${barcode}`);
                    } else {
                        setPendingBarcode(barcode);
                        setShowRequestModal(true);
                    }
                } catch (e) {
                    console.error("Barcode processing failed:", e);
                    await Swal.fire({
                        icon: "error",
                        title: t("barcodeScanner.barcodeProcessFailedTitle"),
                        text: t("barcodeScanner.barcodeProcessFailedText"),
                        confirmButtonText: t("barcodeScanner.confirmButton"),
                    });
                }
            }
        });

        return () => {
            reader.reset();
        };
    }, [stream, navigate, t]);

    // 5. 브라우저 뒤로가기 이벤트에 카메라 종료 추가
    useEffect(() => {
        const handlePopState = () => {
            if (readerRef.current) readerRef.current.reset();
            if (stream) {
                stream.getTracks().forEach((t) => t.stop());
                setStream(null);
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [stream]);

    // 6. 뒤로가기 버튼 클릭 시 카메라 종료 후 네비게이션
    const onBackClick = () => {
        if (readerRef.current) readerRef.current.reset();
        if (stream) {
            stream.getTracks().forEach((t) => t.stop());
            setStream(null);
        }
        navigate(-1);
    };

    const handleRequestClose = () => {
        setShowRequestModal(false);
    };

    return (
        <div className="relative w-full h-full bg-black">
            <style>{`
        .back-button {
          position: absolute; top: 1rem; left: 1rem; z-index: 10;
          width: 48px; height: 48px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0,0,0,0.7); border: 2px solid white; border-radius: 50%;
          color: white; transition: background-color 0.2s;
        }
        .back-button:hover { background: rgba(0,0,0,0.8); }
        .back-button svg { width: 28px; height: 28px; }

        .barcode-guide {
          border: 4px dashed white;
          border-radius: 8px;
          width: 90vw;
          max-width: 800px;
          height: 280px;
        }

        @media (orientation: portrait) {
          .barcode-guide {
            width: 80vw;
            height: 160px;
          }
        }

        @media (orientation: landscape) {
          .barcode-guide {
            width: 70vw;
            height: 200px;
          }
        }
      `}</style>

            <button aria-label="Go back" className="back-button" onClick={onBackClick}>
                <ChevronLeft />
            </button>

            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                muted
                playsInline
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="barcode-guide" />
            </div>

            {showRequestModal && (
                <BarcodeAddRequest barcode={pendingBarcode} onClose={handleRequestClose} />
            )}
        </div>
    );
};

export default BarcodeScannerComponent;