"use client";

import { useSession } from 'next-auth/react';
import { useCart } from '../../app/context/cartContext';
import Link from 'next/link';
import { loadStripe } from "@stripe/stripe-js";

export default function CartPage() {

  const { data: session } = useSession();
  const { state, dispatch } = useCart();

  const totalPrice = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

const handleCheckout= async () => {
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({ items: state.items })
  })

  const data = await response.json();

  if (data.id) {
    // Reindirizza alla pagina Stripe
    await stripe?.redirectToCheckout({ sessionId: data.id });
  }
}

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Il tuo carrello {session?.user?.name && `, ${session.user.name}`}
      </h1>

      {state.items.length === 0 ? (
        <div className="text-center mt-12">
          <p className="text-gray-700 text-lg mb-4"> Il tuo carrello è vuoto </p>
          <Link
            href="/"
            className="inline-block bg-[#FFD814] hover:bg-[#F7CA00] text-sm font-medium text-gray-900 border border-gray-300 px-4 py-2 rounded-md shadow-sm transition-colors"
          >
            Continua lo shopping
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* Colonna sinistra - Prodotti */}
          <div className="md:col-span-2 space-y-6">
            {state.items.map((item) => (
              <div key={item.id} className="flex items-start border border-gray-200 rounded-md p-4 shadow-sm bg-white">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-24 h-24 object-contain mr-4 border border-gray-100 rounded-md"
                />
                <div className="flex-1">
                  <h2 className="font-medium text-gray-800 text-sm line-clamp-2"> {item.title} </h2>
                  <p className="text-gray-600 text-sm mt-1"> ${item.price} </p>
                  <div className="flex items-center mt-3 space-x-2">
                    <button
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                      className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      −
                    </button>
                    <span className="text-sm"> {item.quantity} </span>
                    <button
                      onClick={() =>
                        dispatch({
                          type: 'ADD_ITEM',
                          payload: {
                            id: item.id,
                            title: item.title,
                            price: item.price,
                            image: item.image,
                          },
                        })
                      }
                      className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Colonna destra - Riepilogo */}
          <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm h-fit">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Riepilogo ordine</h2>

            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span> Prodotti ({state.totalItems}) </span>
              <span> ${totalPrice.toFixed(2)} </span>
            </div>

            <div className="border-t border-gray-200 my-4"></div>

            <div className="flex justify-between font-bold text-gray-900 text-base">
              <span> Totale </span>
              <span> ${totalPrice.toFixed(2)} </span>
            </div>

            <button
              onClick={() => dispatch({ type: 'CLEAR_CART' })}
              className="w-full mt-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
            >
              Svuota carrello
            </button>

            <Link
              href="/checkout"
              onClick={handleCheckout}
              className="block w-full mt-4 text-center bg-[#FFD814] hover:bg-[#F7CA00] text-sm font-medium text-gray-900 py-2 rounded-md border border-gray-300 shadow-sm transition-colors"
            >
              Procedi al checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
