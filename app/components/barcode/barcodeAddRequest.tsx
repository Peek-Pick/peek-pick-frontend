import ConfirmModalComponent from "~/components/common/ConfirmModalComponent";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createInquiry } from "~/api/inquiries/inquiriesAPI";
import Swal from "sweetalert2";
import '~/util/swal/customSwal.css'

interface BarcodeAddRequestProps {
    barcode: string;
    onClose: () => void;
}

function BarcodeAddRequest({ barcode, onClose }: BarcodeAddRequestProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        console.log(`Sending product request: ${barcode}`);
        setLoading(true);
        onClose();

        const dto: InquiryRequestDTO = {
            content: `상품 추가 요청: ${barcode}`,
            type: "PRODUCT_ADD",
            imgUrls: [],
        };

        try {
            await createInquiry(dto); // 문의글 생성 API 호출
            await Swal.fire({
                title: "Product addition request has been successfully submitted.",
                icon: "success",
                confirmButtonText: "OK",
                customClass: {
                    popup: "custom-popup",
                    title: "custom-title",
                    actions: "custom-actions",
                    confirmButton: "custom-confirm-button",
                },
            });
        } catch (err) {
            console.error("Error submitting product addition request:", err);
            await Swal.fire({
                title: "Failed to submit product addition request.",
                icon: "error",
                confirmButtonText: "OK",
                customClass: {
                    popup: "custom-popup",
                    title: "custom-title",
                    actions: "custom-actions",
                    confirmButton: "custom-confirm-button",
                },
            });
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
            message={`Barcode: ${barcode}\nNo product information found.\n\nWould you like to request the product to be added?`}
            confirmText={loading ? "Processing..." : "Yes"}
            cancelText="No"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
        />
    );
}

export default BarcodeAddRequest;