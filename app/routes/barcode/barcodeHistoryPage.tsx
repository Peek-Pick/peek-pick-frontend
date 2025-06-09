import BarcodeHistoryComponent from "~/components/barcode/barcodeHistoryComponent";
import BottomNavComponent from "~/components/main/bottomNavComponent";


function BarcodeHistoryPage() {
    return (
        <div>
            <BarcodeHistoryComponent/>
            <BottomNavComponent/>
            {/* 임시 footer 공간 */}
            <div className="h-20" />
        </div>
    );
}

export default BarcodeHistoryPage;