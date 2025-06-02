import {useEffect, useRef, useState} from "react";
import {BarcodeFormat, BrowserMultiFormatReader, DecodeHintType,} from "@zxing/library";
import ModalComponent from "~/components/common/modalComponent";
import {useNavigate} from "react-router-dom";
import {ChevronLeft} from "lucide-react";
import {scanBarcode} from "~/api/barcodeAPI";
import BarcodeAddRequest from "~/components/barcode/BarcodeAddRequest";

const BarcodeScannerComponent = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const readerRef = useRef<BrowserMultiFormatReader | null>(null);
    const navigate = useNavigate();

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [pendingBarcode, setPendingBarcode] = useState<string>("");
    const [showRequestModal, setShowRequestModal] = useState(false);

    // 1. 카메라 권한 확인
    useEffect(() => {
        const checkPermission = async () => {

            const result = await navigator.permissions.query({
                name: "camera" as PermissionName,
            });

            const handleChange = () => {
                if (result.state === "denied" || result.state === "prompt") {
                    setPermissionError("카메라 접근 권한이 필요합니다.");
                    localStorage.removeItem("reloadedAfterPermissionGranted");
                } else if (result.state === "granted") {
                    setPermissionError(null);
                    const hasReloaded = localStorage.getItem("reloadedAfterPermissionGranted");
                    if (!hasReloaded) {
                        localStorage.setItem("reloadedAfterPermissionGranted", "true");
                        window.location.reload();
                    }
                }
            };

            handleChange();
            result.onchange = handleChange;
        };
        checkPermission();
    }, []);

    // 2. Zxing 초기화
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

    // 3. 카메라 On
    useEffect(() => {
        (async () => {
            try {
                const s = await navigator.mediaDevices.getUserMedia({
                    video: {facingMode: "environment"},
                });
                setStream(s);
                if (videoRef.current) {
                    videoRef.current.srcObject = s;
                    await videoRef.current.play().catch(() => {
                    });
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

    // 4. 바코드 인식 → 상품페이지 이동
    useEffect(() => {
        if (!stream || !videoRef.current || !readerRef.current) return;
        const reader = readerRef.current;

        reader.decodeFromStream(stream, videoRef.current, async (res, err) => {
            if (res) {
                const barcode = res.getText();
                reader.reset();
                const result = await scanBarcode(barcode);

                if (result) {
                    navigate(`/products/${barcode}`);
                } else {
                    setPendingBarcode(barcode);
                    setShowRequestModal(true);
                }
            }
        });

        return () => reader.reset();
    }, [stream, navigate]);

    const handleRequestClose = () => {
        setShowRequestModal(false);
    };

    return (
        <div className="relative w-full h-full bg-black">
            {/* 버튼, 바코드 프레임 CSS */}
            <style>{`
            .back-button {
              position: absolute; top: 1rem; left: 1rem; z-index: 10;
              width: 64px; height: 64px;
              display: flex; align-items: center; justify-content: center;
              background: rgba(0,0,0,0.7); border: 2px solid white; border-radius: 50%;
              color: white; transition: background-color 0.2s;
            }
            .back-button:hover { background: rgba(0,0,0,0.8); }
            .back-button svg { width: 40px; height: 40px; }
            @media (orientation: portrait) {
              .back-button { width: 96px; height: 96px; }
              .back-button svg { width: 56px; height: 56px; }
            }
            
            .barcode-guide {
              border: 4px dashed white;
              border-radius: 8px;
              width: 98vw;
              max-width: 800px;
              height: 320px;
            }
            @media (orientation: landscape) {
              .barcode-guide {
                width: 70vw;
                height: 200px;
              }
            }
      `}</style>

            {/* 뒤로가기 버튼 */}
            <button aria-label="뒤로가기" className="back-button" onClick={() => navigate(-1)}>
                <ChevronLeft/>
            </button>

            {/* 카메라 */}
            <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover" muted playsInline/>

            {/* 바코드 가이드 프레임 */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="barcode-guide"/>
            </div>

            {/* 권한오류 모달 */}
            {permissionError && (
                <ModalComponent message={permissionError} onClose={() => {
                    setPermissionError(null);
                }}/>
            )}

            {/* 상품추가요청 모달 */}
            {showRequestModal && (
                <BarcodeAddRequest barcode={pendingBarcode} onClose={handleRequestClose}/>
            )}
        </div>
    );
};

export default BarcodeScannerComponent;