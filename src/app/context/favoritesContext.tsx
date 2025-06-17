"use client";

import { useSession } from 'next-auth/react';
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

interface FavoritesItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface FavoritesState {
  items: FavoritesItem[];
  totalItems: number;
  userName?: string,
}

type FavoritesAction =
  | { type: 'ADD_ITEM'; payload: Omit<FavoritesItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: number } }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'HYDRATE_FAVORITES'; payload: FavoritesState }
  | { type: 'UPDATE_USER'; payload: { userName: string } };


const FavoritesContext = createContext<{
  state: FavoritesState;
  dispatchFavorites: React.Dispatch<FavoritesAction>;
} | undefined>(undefined);

const favoritesReducer = (state: FavoritesState, action: FavoritesAction): FavoritesState => {
  switch (action.type) {
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if(existingItem) {
        return state
      }
      return {
        ...state,
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

    case 'CLEAR_FAVORITES':
      return { items: [], totalItems: 0 };

    case 'HYDRATE_FAVORITES': // Aggiunto nuovo case per l'hydration
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

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {

  const { data: session } = useSession();

  const [state, dispatchFavorites] = useReducer(favoritesReducer, {
    items: [],
    totalItems: 0,
    userName: session?.user?.name || '',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('favorites');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          dispatchFavorites({ type: 'HYDRATE_FAVORITES', payload: parsedState });
        } catch (error) {
          console.error('Failed to parse saved favorite state', error);
        }
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && state) {
      localStorage.setItem('favorites', JSON.stringify(state))
    }
  }, [state])

  return (
    <FavoritesContext.Provider value={{ state, dispatchFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};