import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import type {PointStoreDTO} from "~/types/points/points";


interface Props {
    data: PointStoreDTO;
}


export default function ReadComponent({data} : Props) {


    console.log(data)

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">🧐 상품 상세 정보</h2>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                    <img
                        src={`http://localhost:8080/uploads/${data.imgUrl}`}
                        alt={data.item}
                        className="w-full h-auto object-cover rounded border"
                    />
                </div>

                <div className="w-full md:w-2/3 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">상품명</h3>
                        <p className="text-gray-800">{data.item}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">가격</h3>
                        <p className="text-gray-800">{data.price.toLocaleString()}P</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">설명</h3>
                        <p className="text-gray-700 whitespace-pre-line">{data.description}</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">타입</h3>
                        <p className="text-gray-700">{data.productType}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex gap-4">
                <Link
                    to={`/admin/points/edit/${data.pointstoreId}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    수정
                </Link>
                <Link
                    to="/admin/points/list"
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                    목록으로
                </Link>
            </div>
        </div>
    );
}
