import BarcodeHistoryComponent from "~/components/barcode/barcodeHistoryComponent";
import {BackButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";


function BarcodeHistoryPage() {
    return (
        <div>
            <BackButton />
            <FloatingActionButtons />
            <BarcodeHistoryComponent/>
            <div className="h-15" />
        </div>
    );
}

export default BarcodeHistoryPage;