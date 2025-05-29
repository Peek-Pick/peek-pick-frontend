import ConfirmModalComponent from "~/components/common/ConfirmModalComponent";
import {useNavigate} from "react-router-dom";

interface BarcodeAddRequestProps {
    barcode: string;
    onClose: () => void;
}

function BarcodeAddRequest({ barcode, onClose }: BarcodeAddRequestProps) {
    const navigate = useNavigate();

    const handleConfirm = () => {
        // TODO: 문의 게시판 생성 API 연동 예정
        console.log(`상품 요청 전송: ${barcode}`);
        onClose();
    };

    const handleCancel = () => {
        navigate(-1); // No 클릭 시 이전 페이지로 이동
    };

    return (
        <ConfirmModalComponent
            message={"해당 상품 정보가 없습니다.\n관리자에게 추가 요청하시겠습니까?"}
            confirmText="Yes"
            cancelText="No"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );
}

export default BarcodeAddRequest;
