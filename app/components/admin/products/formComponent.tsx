import { useState, useEffect, type FormEvent, type ReactNode } from "react";

export interface ProductFormValues {
    name: string;
    barcode: string;
    description?: string;
    category?: string;
    volume?: string;
    ingredients?: string;
    allergens?: string;
    nutrition?: string;
}

interface Props {
    initial?: ProductFormValues;
    onSubmit: (values: ProductFormValues) => void;
    children?: ReactNode;
}

export default function ProductFormComponent({
                                                 initial,
                                                 onSubmit,
                                                 children,
                                             }: Props) {
    const [values, setValues] = useState<ProductFormValues>({
        name: "",
        barcode: "",
        description: "",
        category: "",
        volume: "",
        ingredients: "",
        allergens: "",
        nutrition: "",
    });

    // initial prop이 바뀔 때마다 폼 값 업데이트
    useEffect(() => {
        if (initial) {
            setValues({
                name: initial.name,
                barcode: initial.barcode,
                description: initial.description ?? "",
                category: initial.category ?? "",
                volume: initial.volume ?? "",
                ingredients: initial.ingredients ?? "",
                allergens: initial.allergens ?? "",
                nutrition: initial.nutrition ?? "",
            });
        }
    }, [initial]);

    const handleChange =
        (key: keyof ProductFormValues) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setValues((prev) => ({ ...prev, [key]: e.target.value }));
            };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(values);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 상품명 */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                    상품명
                </label>
                <input
                    type="text"
                    value={values.name}
                    onChange={handleChange("name")}
                    required
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* 바코드 */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                    바코드
                </label>
                <input
                    type="text"
                    value={values.barcode}
                    onChange={handleChange("barcode")}
                    required
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
            </div>

            {/* 상세 설명 */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                    상세 설명
                </label>
                <textarea
                    value={values.description}
                    onChange={handleChange("description")}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 whitespace-pre-line"
                />
            </div>

            {/* 카테고리 / 용량 */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        카테고리
                    </label>
                    <input
                        type="text"
                        value={values.category}
                        onChange={handleChange("category")}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        용량
                    </label>
                    <input
                        type="text"
                        value={values.volume}
                        onChange={handleChange("volume")}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* 원재료 */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                    원재료
                </label>
                <textarea
                    value={values.ingredients}
                    onChange={handleChange("ingredients")}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 whitespace-pre-line"
                />
            </div>

            {/* 알레르기 정보 / 영양 성분 */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        알레르기 정보
                    </label>
                    <input
                        type="text"
                        value={values.allergens}
                        onChange={handleChange("allergens")}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
                        영양 성분
                    </label>
                    <textarea
                        value={values.nutrition}
                        onChange={handleChange("nutrition")}
                        className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 whitespace-pre-line"
                    />
                </div>
            </div>

            {/* 폼 액션 버튼 */}
            {children}
        </form>
    );
}
