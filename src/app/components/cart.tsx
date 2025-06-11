"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "../context/cartContext";

export default function Cart() {
  const { state } = useCart();

  return (
    <div className="relative">
      <Link
        href="/cart"
        className="flex items-center gap-2 px-4 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-gray-300 rounded-md text-sm font-medium text-gray-900 shadow-sm transition-colors"
      >
        <Image src="/icons/cart.svg" alt="Carrello" width={20} height={20} />
        <span>Carrello</span>
      </Link>

      {state.totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
          {state.totalItems}
        </span>
      )}
    </div>
  );
}
