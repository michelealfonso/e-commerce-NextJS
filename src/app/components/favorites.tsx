"use client";
import Link from "next/link";
import Image from "next/image";
import { useFavorites } from "../context/favoritesContext";

export default function Favorites() {

    const { state } = useFavorites()

    return (
        <div>
            <Link
                href="/favorites"
                className="flex items-center gap-2 px-4 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] border border-gray-300 rounded-md text-sm font-medium text-gray-900 shadow-sm transition-colors"
            >
                <Image src="./icons/heart.svg" alt="Carrello" width={20} height={20} />
                <span> Preferiti </span>
            </Link>

            {
                state.totalItems > 0 && (
                    <span className="absolute top-[15px] right-[150px] bg-red-600 text-white text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                        {state.totalItems}
                    </span>
                )
            }
        </div>
    )
}