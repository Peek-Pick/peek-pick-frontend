import axiosInstance from "~/instance/axiosInstance";
import type {ProductListDTO, PageResponse, ProductDetailDTO} from "~/types/products";


const host = "http://localhost:8080/api/v1/products";


export async function listProducts(page: number, size: number, sort: string = "likeCount,DESC",category?: string, keyword?: string)
    : Promise<PageResponse<ProductListDTO>> {
    const res = await axiosInstance.get<PageResponse<ProductListDTO>>(
        `${host}/ranking`,
        {params:
            {
            page, size, sort, ...(category && { category }), ...(keyword && { keyword }),
            },
        }
    );
    return res.data;
}

export async function getProductDetail(
    barcode: string
): Promise<ProductDetailDTO> {
    const res = await axiosInstance.get<ProductDetailDTO>(
        `${host}/${barcode}`
    );
    return res.data;
}

