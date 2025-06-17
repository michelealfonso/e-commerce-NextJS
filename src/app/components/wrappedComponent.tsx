'use client'

import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '../context/cartContext'
import { FavoritesProvider } from '../context/favoritesContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
        </FavoritesProvider>
      </CartProvider>
    </SessionProvider>
  )
}