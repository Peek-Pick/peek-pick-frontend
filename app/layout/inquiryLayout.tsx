import {Outlet} from "react-router-dom";

function InquiryLayout() {
    return (
        <div className="p-4 border">
            <h2 className="text-xl font-semibold mb-2">문의 관리</h2>
            <Outlet/>
        </div>
    );
}

export default InquiryLayout;