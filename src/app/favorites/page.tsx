'use client';

import { useSession } from "next-auth/react";
import { useFavorites } from "../context/favoritesContext";
import Link from "next/link";
import { useCart } from "../context/cartContext";
import Cart from "../components/cart";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { removeItem } from "../redux/favoritesSlice";
import { RootState } from "../redux/store";

export default function FavoritesPage() {
    const { data: session } = useSession();

    const favorites = useAppSelector((state: RootState) => state.favorites);
    const { dispatch: cartDispatch } = useCart();
    const dispatch = useAppDispatch();


    return (
        <>
            <div className="flex justify-end items-center p-6">
                <Cart />
            </div>
            <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
                <div className="w-full max-w-6xl">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                        I tuoi preferiti {session?.user?.name && `, ${session.user.name}`}
                    </h1>

                    {favorites.items.length === 0 ? (
                        <div className="text-center mt-12">
                            <p className="text-gray-700 text-lg mb-4">Non hai ancora salvato prodotti nei preferiti.</p>
                            <Link
                                href="/"
                                className="inline-block bg-[#FFD814] hover:bg-[#F7CA00] text-sm font-medium text-gray-900 border border-gray-300 px-4 py-2 rounded-md shadow-sm transition-colors"
                            >
                                Torna allo shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items.-center gap-5">
                            <div className="max-w-6xl flex flex-col gap-8 justify-center">
                                {favorites.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start border border-gray-200 rounded-md p-4 shadow-sm bg-white"
                                    >

                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            width={96}
                                            height={96}
                                            className="object-contain mr-4 border border-gray-100 rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h2 className="font-medium text-gray-800 text-sm line-clamp-2">
                                                {item.title}
                                            </h2>
                                            <p className="text-gray-600 text-sm mt-1">€ {item.price.toFixed(2)}</p>
                                            <div className="mt-3 flex gap-2">
                                                <button
                                                    // onClick={() =>
                                                    //     dispatchFavorites({ type: 'REMOVE_ITEM', payload: { id: item.id } })
                                                    // }
                                                    onClick={() => {
                                                        dispatch(removeItem({id: item.id}))
                                                    }}
                                                    className="px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                                                >
                                                    Rimuovi
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        cartDispatch({
                                                            type: 'ADD_ITEM',
                                                            payload: {
                                                                id: item.id,
                                                                title: item.title,
                                                                price: item.price,
                                                                image: item.image,
                                                            },
                                                        });
                                                        // alert(`${item.title} aggiunto al carrello`);
                                                    }}
                                                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                                >
                                                    Aggiungi al carrello
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center items-center">
                                <Link
                                    href="/"
                                    className="inline-block bg-[#FFD814] hover:bg-[#F7CA00] text-sm font-medium text-gray-900 border border-gray-300 px-4 py-2 rounded-md shadow-sm transition-colors"
                                >
                                    Torna allo shopping
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
