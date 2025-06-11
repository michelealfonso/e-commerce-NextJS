"use client";

import Link from "next/link";
import { useCart } from "../context/cartContext";
import { useEffect, useState } from "react";

async function getProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4 text-gray-800">Prodotti in evidenza</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="border border-gray-300 rounded-md bg-white p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <Link href={`/product/${product.id}`} className="group block">
              <div className="aspect-square mb-3 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>

              <h2 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">
                {product.title}
              </h2>

              <div className="mt-2 flex items-center text-xs text-yellow-500">
                ★★★★★ <span className="ml-1 text-gray-500">(0)</span>
              </div>

              <p className="mt-1 text-sm font-bold text-gray-900">${product.price}</p>
              {product.price > 20 && (
                <p className="text-xs text-gray-600">Spedizione gratuita</p>
              )}
            </Link>

            <button
              onClick={() =>
                dispatch({
                  type: 'ADD_ITEM',
                  payload: {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                  },
                })
              }
              className="mt-3 w-full bg-[#FFD814] hover:bg-[#F7CA00] text-sm font-medium text-gray-900 border border-gray-300 py-1.5 rounded-md shadow-sm transition-colors"
            >
              Aggiungi al carrello
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
