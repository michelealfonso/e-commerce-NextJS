"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/cartContext";
import { useEffect, useState } from "react";
import AddProductModal from "./addProductModal";

async function getFakeProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

async function getLocalProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      return null
    }
    return await response.json();
  } catch {
    return [];
  }
}

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const { dispatch } = useCart();

  const [showModal, setShowModal] = useState(false)

  const fetchProducts = async () => {
    const fakeStoreProducts = await getFakeProducts();
    const localProduct = await getLocalProducts();

    const normalizedFakeStoreProducts = fakeStoreProducts.map((p: any) => ({
      id: p.id,
      name: p.title,
      description: p.description,
      price: p.price,
      imageUrl: p.image,
      source: 'fakeStore',
    }));

    const normalizedLocalProducts = localProduct.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      imageUrl: p.imageUrl,
      source: 'local',
    }));

    setProducts([...normalizedFakeStoreProducts, ...normalizedLocalProducts]);
  };

  useEffect(() => {
    fetchProducts()
  }, [])

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <div className="w-full max-w-7xl flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">Prodotti in evidenza</h1>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm font-semibold bg-[#FFD814] hover:bg-[#F7CA00] text-gray-900 border border-gray-300 px-4 py-2 rounded shadow-sm transition-colors"
          >
            Aggiungi
          </button>
        </div>

        {showModal && (
          <AddProductModal
            onClose={() => setShowModal(false)}
            onProductAdded={fetchProducts}
          />
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded bg-white p-3 flex flex-col justify-between shadow hover:shadow-md transition-shadow"
            >
              <Link href={`/product/${product.id}`} className="group block">
                <div className="aspect-square mb-2 overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                  />
                </div>

                <h2 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[2.5rem]">
                  {product.name}
                </h2>

                <div className="mt-1 text-xs text-yellow-500">
                  ★★★★★ <span className="ml-1 text-gray-500">(0)</span>
                </div>

                <p className="mt-1 text-sm font-semibold text-gray-900">${product.price}</p>
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
                      title: product.name,
                      price: product.price,
                      image: product.imageUrl,
                    },
                  })
                }
                className="mt-3 w-full bg-[#FFD814] hover:bg-[#F7CA00] text-xs font-medium text-gray-900 border border-gray-300 py-1.5 rounded-md shadow-sm transition-colors"
              >
                Aggiungi al carrello
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
