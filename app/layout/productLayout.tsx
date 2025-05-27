import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function ProductLayout({ children }: Props) {
    return (
        <div className="p-4 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">상품 랭킹</h1>
            {children}
        </div>
    );
}
