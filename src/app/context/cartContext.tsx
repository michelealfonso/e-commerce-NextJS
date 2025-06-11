"use client";

import { useSession } from 'next-auth/react';
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  userName?: string,
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'CLEAR_CART' }
  | { type: 'HYDRATE_CART'; payload: CartState }
  | { type: 'UPDATE_USER'; payload: { userName: string } };


const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          totalItems: state.totalItems + 1,
        };
      }
      return {
        items: [...state.items, { ...action.payload, quantity: 1 }],
        totalItems: state.totalItems + 1,
      };

    case 'REMOVE_ITEM':
      const itemToRemove = state.items.find(item => item.id === action.payload.id);
      if (!itemToRemove) return state;

      if (itemToRemove.quantity > 1) {
        return {
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          ),
          totalItems: state.totalItems - 1,
        };
      }
      return {
        items: state.items.filter(item => item.id !== action.payload.id),
        totalItems: state.totalItems - 1,
      };

    case 'CLEAR_CART':
      return { items: [], totalItems: 0 };

    case 'HYDRATE_CART': // Aggiunto nuovo case per l'hydration
      return action.payload;

      case 'UPDATE_USER':
        return {
          ...state,
          userName: action.payload.userName
        }

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {

  const { data: session } = useSession();

  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    userName: session?.user?.name || '',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('cart');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          dispatch({ type: 'HYDRATE_CART', payload: parsedState });
        } catch (error) {
          console.error('Failed to parse saved cart state', error);
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && state) {
      localStorage.setItem('cart', JSON.stringify(state))
    }
  }, [state])

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};