// redux/favoritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  userName?: string;
}

const initialState: FavoritesState = {
  items: [],
  totalItems: 0,
  userName: '',
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Omit<FavoritesItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push({ ...action.payload, quantity: 1 });
        state.totalItems += 1;
      }
    },

    removeItem: (state, action: PayloadAction<{ id: number }>) => {
      const itemToRemove = state.items.find(item => item.id === action.payload.id);
      if (!itemToRemove) return;

      if (itemToRemove.quantity > 1) {
        itemToRemove.quantity -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      }

      state.totalItems -= 1;
    },

    clearFavorites: (state) => {
      state.items = [];
      state.totalItems = 0;
    },

    hydrateFavorites: (state, action: PayloadAction<FavoritesState>) => {
      return action.payload;
    },

    updateUser: (state, action: PayloadAction<{ userName: string }>) => {
      state.userName = action.payload.userName;
    },
  },
});

export const {
  addItem,
  removeItem,
  clearFavorites,
  hydrateFavorites,
  updateUser,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
