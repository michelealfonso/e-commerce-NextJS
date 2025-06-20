import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Playball } from "next/font/google";

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

const initialState: CartState = {
    items: [],
    totalItems: 0,
    userName: '',
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
          addItem: (state, action: PayloadAction<Omit<CartItem, 'quantity'>>) => {
              const existingItem = state.items.find(item => item.id === action.payload.id);

              if(existingItem) {
                existingItem.quantity += 1
              }
              else {
                state.items.push({...action.payload, quantity: 1})
              }

              state.totalItems += 1
        },

        removeItem: (state, action: PayloadAction<{ id: number }>) => {
            const itemToRemove = state.items.find(i => i.id === action.payload.id);
            if(!itemToRemove) return;

            if(itemToRemove.quantity > 1) {
                itemToRemove.quantity -= 1;
            }

            else {
                state.items = state.items.filter(i => i.id !== action.payload.id)
            }

            state.totalItems -= 1;
        },

        clearCart: (state) => {
            state.items = [];
            state.totalItems = 0;
        },

        hydrateCart: (state, action: PayloadAction<CartState>) => {
            return action.payload
        },

        updateUser: (state, action: PayloadAction<{userName: string}>) => {
            state.userName = action.payload.userName;
        },
    },
});

export const { 
    addItem, 
    removeItem, 
    clearCart, 
    hydrateCart, 
    updateUser 
} = cartSlice.actions;

export default cartSlice.reducer;