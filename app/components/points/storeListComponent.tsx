import type { PointStoreListDTO } from "~/types/points";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import PointsLoading from "~/util/loading/pointsLoading";

interface Props {
    products: PointStoreListDTO[];
    onProductClick: (product: PointStoreListDTO) => void;
}

export default function StoreListComponent({ products, onProductClick}: Props) {

    return (
        <div className="container mx-auto">

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
                {products.map((product) => (
                    <div
                        key={product.pointstoreId}
                        className="cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 relative"
                    >
                        <div className="relative">
                            <img
                                src={`http://localhost/points/${product.imgUrl}`}
                                alt={product.item}
                                className="w-full h-28 object-cover rounded-t-lg"
                            />
                            {/* 구매 버튼 */}
                            <button
                                onClick={() => onProductClick(product)}
                                className="absolute top-2 right-2 bg-white bg-opacity-90 rounded-full p-1.5 shadow hover:bg-blue-100 transition"
                            >
                                <FontAwesomeIcon icon={faShoppingBag} style={{ color: '#6b7280' }} />
                            </button>
                        </div>
                        <div className="p-3 flex flex-col text-center">
                            <span className="inline-block mb-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-medium">
                                {product.productType}
                            </span>
                            <h6 className="text-sm font-medium mb-1 truncate">{product.item}</h6>
                            <p className="text-yellow-500 font-semibold text-sm">{product.price} points</p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}
