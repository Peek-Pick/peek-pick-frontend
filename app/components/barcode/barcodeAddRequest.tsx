import ConfirmModalComponent from "~/components/common/ConfirmModalComponent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createInquiry } from "~/api/inquiries/inquiriesAPI";

interface BarcodeAddRequestProps {
    barcode: string;
    onClose: () => void;
}

function BarcodeAddRequest({ barcode, onClose }: BarcodeAddRequestProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        console.log(`상품 요청 전송: ${barcode}`);
        setLoading(true);

        const dto: InquiryRequestDTO = {
            content: `상품 추가 요청: ${barcode}`,
            type: "PRODUCT_ADD",
            imgUrls: [],
        };

        try {
            await createInquiry(dto); // 문의글 생성 API 호출
            alert("상품 추가 요청이 정상적으로 전송되었습니다.");
        } catch (err) {
            console.error("상품 추가 요청 중 오류:", err);
            alert("상품 추가 요청에 실패했습니다.");
        } finally {
            setLoading(false);
            onClose();
            navigate(-1);
        }
    };

    const handleCancel = () => {
        navigate(-1); // No 클릭 시 이전 페이지로 이동
    };

    return (
        <ConfirmModalComponent
            message={`바코드 번호: ${barcode}\n상품 정보가 없습니다.\n바코드 번호를 다시 한 번 확인해주세요!\n\n관리자에게 추가 요청하시겠습니까?`}
            confirmText={loading ? "처리 중..." : "Yes"}
            cancelText="No"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );
}

export default BarcodeAddRequest;
