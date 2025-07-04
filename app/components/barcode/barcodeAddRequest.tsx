import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createInquiry } from "~/api/inquiries/inquiriesAPI";
import Swal from "sweetalert2";
import "~/util/swal/customSwal.css";
import { useTranslation } from "react-i18next";

interface BarcodeAddRequestProps {
    barcode: string;
    onClose: () => void;
}

function BarcodeAddRequest({ barcode, onClose }: BarcodeAddRequestProps) {
    // 국제화
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const showConfirmModal = async () => {
            const result = await Swal.fire({
                title: `${t("barcodeAddModalTitle")} ${barcode}`,
                html: `${t("barcodeAddModalBody")}`,
                icon: "question",
                showCancelButton: true,
                confirmButtonText: t("confirmRequestButtonText"),
                cancelButtonText: t("cancelButtonText"),
                customClass: {
                    popup: "custom-popup",
                    title: "custom-title",
                    htmlContainer: "custom-html",
                    actions: "custom-actions",
                    confirmButton: "custom-confirm-button",
                    cancelButton: "custom-cancel-button",
                },
            });

            if (result.isConfirmed) {
                try {
                    const dto = {
                        content: `상품 추가 요청: ${barcode}`,
                        type: "PRODUCT_ADD" as InquiryType,
                        imgUrls: [],
                    };

                    await createInquiry(dto);

                    await Swal.fire({
                        icon: "success",
                        title: t("barcodeAddSuccess"),
                        confirmButtonText: t("confirmOKButtonText"),
                        customClass: {
                            popup: "custom-popup",
                            title: "custom-title",
                            confirmButton: "custom-confirm-button",
                        },
                    });
                } catch (err) {
                    console.error("상품 요청 실패:", err);
                    await Swal.fire({
                        icon: "error",
                        title: t("barcodeAddError"),
                        confirmButtonText: t("confirmOKButtonText"),
                        customClass: {
                            popup: "custom-popup",
                            title: "custom-title",
                            confirmButton: "custom-confirm-button",
                        },
                    });
                } finally {
                    onClose();
                    navigate(-1);
                }
            } else {
                onClose();
                navigate(-1);
            }
        };

        showConfirmModal();
    }, [barcode, navigate, onClose, t]);

    return null;
}

export default BarcodeAddRequest;