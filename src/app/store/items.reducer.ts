import { createReducer, on } from "@ngrx/store"
import { CartItem } from "../models/cartItem"
import { add } from "./items.actions"

export interface ItemsState{
    items: CartItem[],
    total: number
}

export const initialState: ItemsState = {
    items: JSON.parse(sessionStorage.getItem('cart') || '[]'),
    total: 0,
}

export const itemsReducer = createReducer(
    initialState,
    on(add, (state, {product}) => {
        const hasItem = state.items.find((item: CartItem) => item.product.id === product.id);
      if (hasItem) {
        return {
            items: state.items.map((item: CartItem) => {
                if (item.product.id === product.id) 
                    {
                        return {
                        ... item,
                        quantiy: item.quantiy +1
                        }
                    }
                return item;
            }),
            
        };
      } else {
        return [... state.items, { product: { ... product }, quantiy: 1}];  
      } 
    })
)