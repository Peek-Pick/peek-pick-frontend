import {
    useState,
    useEffect,
    type FormEvent,
    type ReactNode,
    useRef,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";

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
    onFileChange?: (file: File | null) => void;
    fileLabel?: string;
    showDeleteCheckbox?: boolean;
    isDelete?: boolean;
    onToggleDelete?: () => void;
}

export default function ProductFormComponent({
                                                 initial,
                                                 onSubmit,
                                                 onFileChange,
                                                 fileLabel = "이미지 필수",
                                                 showDeleteCheckbox = false,
                                                 isDelete = false,
                                                 onToggleDelete,
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

    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (onFileChange) {
            onFileChange(file);
        }
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

            {/* 이미지 업로드 */}
            <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">
                    이미지 파일
                </label>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition"
                    >
                        <FontAwesomeIcon icon={faImage} />
                        이미지 선택
                    </button>
                    <span
                        className={`truncate max-w-xs ${
                            fileLabel === "이미지 필수" ? "text-red-500" : "text-gray-600"
                        }`}
                    >
                        {fileLabel}
                    </span>
                </div>
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
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

            {/* 삭제 여부 토글 */}
            {showDeleteCheckbox && (
                <div className="flex items-center gap-2">
                    <input
                        id="isDeleteToggle"
                        type="checkbox"
                        checked={isDelete}
                        onChange={onToggleDelete}
                        className="w-4 h-4"
                    />
                    <label htmlFor="isDeleteToggle" className="text-sm text-gray-700">
                        삭제 처리 여부
                    </label>
                </div>
            )}
        </form>
    );
}
