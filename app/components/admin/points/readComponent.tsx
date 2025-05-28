import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import type { PointStoreDTO } from "~/types/points";

interface Props {
    data: PointStoreDTO;
}
export default function ReadComponent({ data }: Props) {
    console.log(data);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 text-gray-800 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-6 border-b pb-2">상품 상세 정보</h2>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 flex justify-center items-center">
                    <img
                        src={`http://localhost:8080/uploads/${data.imgUrl}`}
                        alt={data.item}
                        className="w-full max-h-64 object-contain rounded-md border border-gray-200 shadow-sm"
                    />
                </div>

                <div className="w-full md:w-2/3 space-y-6">
                    {[
                        { label: "상품명", value: data.item },
                        { label: "가격", value: `${data.price.toLocaleString()}P` },
                        { label: "설명", value: data.description, isDescription: true },
                        { label: "타입", value: data.productType },
                    ].map(({ label, value, isDescription }, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-lg p-5 shadow-sm border border-gray-100"
                            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}
                        >
                            <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{label}</h3>
                            <p
                                className={`text-gray-900 ${isDescription ? "whitespace-pre-line leading-relaxed" : "font-medium"}`}
                                style={{ fontSize: isDescription ? "0.9rem" : "1rem" }}
                            >
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

            </div>

            <div className="mt-8 flex gap-3 justify-end">
                <Link
                    to={`/admin/points/edit/${data.pointstoreId}`}
                    className="flex items-center gap-1 rounded-md border border-blue-600 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm hover:bg-blue-100 hover:text-blue-800 transition"
                >
                    수정
                </Link>
                <Link
                    to="/admin/points/list"
                    className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 hover:text-gray-800 transition"
                >
                    목록으로
                </Link>
            </div>
        </div>
    );
}
