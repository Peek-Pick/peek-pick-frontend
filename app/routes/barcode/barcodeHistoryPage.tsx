import BarcodeHistoryComponent from "~/components/barcode/barcodeHistoryComponent";
import {BackButton, FloatingActionButtons} from "~/util/button/FloatingActionButtons";


function BarcodeHistoryPage() {
    return (
        <div>
            <BarcodeHistoryComponent/>

            <div className="h-15" />
            <BackButton />
            <FloatingActionButtons />
        </div>
    );
}

export default BarcodeHistoryPage;