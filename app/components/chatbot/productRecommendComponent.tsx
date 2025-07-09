import {useNavigate} from "react-router";
import {Link} from "react-router-dom";

export default function ProductRecommendComponent({ product }) {

    console.log(product.imgUrl);
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center max-w-md mx-auto border border-gray-100">
            <h2 className="text-md font-semibold mb-2">
                {product.productName}
            </h2>

            <img
                src={`http://localhost${product.imgUrl}`}
                alt={product.productName}
                className="w-[160px] mx-auto rounded-lg shadow-sm mb-4"
            />

            <p className="text-sm text-gray-800 mb-5 leading-relaxed">
                {product.reason}
            </p>

            <Link
                to={`/products/${product.barcode}`}
                className="inline-block px-5 py-2 rounded-full border border-gray-300 bg-white text-gray-800 text-sm hover:bg-gray-100 hover:shadow-md transition-all duration-200 font-medium"
            >
                View Prodcut{/*상품 보러가기*/}
            </Link>
        </div>

    );
}
