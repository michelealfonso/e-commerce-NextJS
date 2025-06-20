// store di redux 

`
Lo store è il cuore centrale dell'app ed è un oggetto che contiene tutto lo stato globale della nostra app.
Permette di fare cose come:
1. Leggere lo stato (getState())
2. Inviare azioni tramite (dispatch)
3. Sottoscriversi a cambiamenti tramite (subscribe)
`

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import favoritesReducer from "./favoritesSlice";

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        favorites: favoritesReducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;