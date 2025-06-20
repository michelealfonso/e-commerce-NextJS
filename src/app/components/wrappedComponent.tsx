'use client'

import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '../context/cartContext'
import { FavoritesProvider } from '../context/favoritesContext'
import { Provider } from 'react-redux'
import { store } from '../redux/store'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <CartProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </CartProvider>
      </SessionProvider>
    </Provider>
  )
}