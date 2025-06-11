import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listAdminProducts } from "~/api/products/adminProductsAPI";
import type { PageResponse, ProductListDTO } from "~/types/products";
import { useNavigate } from "react-router";
import LoadingComponent from "~/components/common/loadingComponent";
import PaginationComponent from "~/components/common/PaginationComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBox,
    faHeart,
    faStar,
    faPlus,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminProductsListComponent() {
    const [page, setPage] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [searchKeyword, setSearchKeyword] = useState("");
    const size = 10;
    const navigate = useNavigate();

    // Enter 또는 버튼 클릭 시 실제 검색어로 설정하고 페이지 초기화
    const handleSearch = () => {
        setPage(0);
        setSearchKeyword(inputValue.trim());
    };

    const { data, isLoading, isError } = useQuery<
        PageResponse<ProductListDTO>,
        Error
    >({
        queryKey: ["adminProducts", page, searchKeyword] as const,
        queryFn: () => listAdminProducts(page, size, searchKeyword),
    });

    if (isLoading) return <LoadingComponent isLoading />;
    if (isError || !data)
        return <div className="p-4 text-red-500">상품 목록 불러오기 실패</div>;

    const products = data.content;
    const totalPages = data.totalPages;

    return (
        <div className="max-w-7xl mx-auto px-4">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faBox} /> 상품 관리
            </h3>

            <div className="mb-4 flex items-center justify-between">
                {/* 검색창 */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="상품명/설명 검색"
                        className="w-64 px-2 py-1 border rounded text-sm focus:outline-none focus:ring"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition"
                    >
                        검색
                    </button>
                </div>
                {/* 상품 등록 버튼 */}
                <button
                    onClick={() => navigate("/admin/products/add")}
                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition"
                >
                    <FontAwesomeIcon icon={faPlus} />
                    새 상품 등록
                </button>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
                <table className="min-w-full text-sm divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="w-12 px-4 py-2 text-left text-xs font-medium text-gray-500">
                            #
                        </th>
                        <th className="w-24 px-4 py-2 text-left text-xs font-medium text-gray-500">
                            이미지
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            상품명 / 바코드
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            좋아요·별점
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                            삭제여부
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {products.length === 0 ? (
                        <tr>
                            <td
                                colSpan={5}
                                className="px-4 py-4 text-center text-gray-500"
                            >
                                등록된 상품이 없습니다.
                            </td>
                        </tr>
                    ) : (
                        products.map((p) => (
                            <tr
                                key={p.productId}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() =>
                                    navigate(`/admin/products/${p.productId}`)
                                }
                            >
                                <td className="px-4 py-3 align-middle">
                                    {p.productId}
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    {p.imgUrl ? (
                                        <img
                                            src={p.imgUrl}
                                            alt={p.name}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    <div className="font-medium text-gray-900">
                                        {p.name}
                                    </div>
                                    <div className="text-gray-500 text-xs">
                                        {p.barcode}
                                    </div>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                    <div className="inline-flex items-center space-x-1">
                                        <FontAwesomeIcon
                                            icon={faHeart}
                                            className="w-5 h-5 text-red-500"
                                        />
                                        <span className="font-medium">
                                                {p.likeCount ?? 0}
                                            </span>
                                    </div>
                                    <div className="inline-flex items-center space-x-1 ml-4">
                                        <FontAwesomeIcon
                                            icon={faStar}
                                            className="w-5 h-5 text-yellow-400"
                                        />
                                        <span className="font-medium">
                                                {p.score?.toFixed(1) ?? "0.0"} (
                                            {p.reviewCount ?? 0})
                                            </span>
                                    </div>
                                </td>
                                <td className="px-4 py-3 align-middle">
                                        <span
                                            className={`text-sm font-semibold ${
                                                p.isDelete
                                                    ? "text-red-600"
                                                    : "text-lime-600"
                                            }`}
                                        >
                                            {p.isDelete ? "삭제됨" : "정상"}
                                        </span>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            <PaginationComponent
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                maxPageButtons={10}
            />
        </div>
    );
}
