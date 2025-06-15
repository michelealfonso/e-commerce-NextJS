"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../context/cartContext";
import Link from "next/link";

async function getFakeProducts(id: string) {
    try {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }
        return await response.json();
    }
    catch (error) {
        console.error("Error fetching product", error);
        return null;
    }
}

async function getLocalProducts(id: string) {
    try {
        const response = await fetch(`/api/product/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }
        return await response.json();
        // const data = await response.json();
        // return data;
    }
    catch (error) {
        console.error("Error fetching product", error);
        return null;
    }
}

export default function ProductPage() {

    const params = useParams();
    const idParam = params.id;

    let id: string | null = null;

    if (typeof idParam === "string") {
        id = idParam;
    } else if (Array.isArray(idParam)) {
        id = idParam[0];
    }


    const [product, setProduct] = useState<any | null>(null);
    const { dispatch } = useCart();

    useEffect(() => {
        async function fetchProduct() {
            if (!id) return;

            let localProduct = await getLocalProducts(id);
            if (localProduct) {
                setProduct(localProduct);
            } else {
                let fakeProduct = await getFakeProducts(id);
                setProduct(fakeProduct);
            }
        }
        fetchProduct();
    }, [id]);

    if (!product) {
        return <div className="p-6">Caricamento...</div>
    }

    const isLocal = product._source === "local";

    return (
        <div className="max-w-4xl h-screen flex justify-center items-center mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                <div className="border border-gray-200 rounded-md bg-white p-4 shadow-sm">
                    <div className="aspect-square overflow-hidden">
                        <img
                            src={isLocal ? product.imageUrl : product.image}
                            alt={isLocal ? product.name : product.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                            {isLocal ? product.name : product.title}
                        </h1>
                        <p className="text-sm text-gray-600 mb-4">  
                            { product.description }
                        </p>

                        <div className="flex items-center text-sm text-yellow-500 mb-2">
                            ★★★★☆ <span className="ml-2 text-gray-500">(rating {product.rating?.rate ?? 0})</span>
                        </div>

                        <p className="text-xl font-bold text-gray-900">${product.price}</p>
                        {product.price > 20 && (
                            <p className="text-sm text-gray-600 mt-1">Spedizione gratuita inclusa</p>
                        )}
                    </div>

                    <button
                        onClick={() =>
                            dispatch({
                                type: "ADD_ITEM",
                                payload: {
                                    id: product.id,
                                    title: isLocal ? product.name : product.title,
                                    price: product.price,
                                    image: isLocal ? product.imageUrl : product.image,
                                },
                            })
                        }
                        className="mt-6 w-full bg-[#FFD814] hover:bg-[#F7CA00] text-sm font-medium text-gray-900 border border-gray-300 py-2 rounded-md shadow-sm transition-colors"
                    >
                        Aggiungi al carrello
                    </button>

                    <Link
                        href="/"
                        className="mt-4 text-sm text-blue-600 hover:underline inline-block"
                    >
                        ← Torna ai prodotti
                    </Link>
                </div>
            </div>
        </div>
    )
}