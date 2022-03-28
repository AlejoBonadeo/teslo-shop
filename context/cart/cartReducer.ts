import { CartState } from '.';
import { CartProduct, ValidSizes } from "../../interfaces";
import { BillingAddress } from '../../interfaces';

type Action =
  | { type: "loadCart"; payload: CartProduct[] }
  | { type: "addProduct"; payload: CartProduct }
  | { type: "updateQuantity"; payload: CartProduct }
  | { type: "removeProduct"; payload: {id: string, size: ValidSizes} }
  | { type: "addBillingAddress"; payload: BillingAddress }
  | { type: "orderComplete" };

export const cartReducer = (state: CartState, action: Action): CartState => {
  switch (action.type) {
    case "loadCart":
      return {
        ...state,
        cart: action.payload,
        isLoaded: true,
      };
    case "addProduct":
      return {
        ...state,
        cart: state.cart.find(
          (i) => i._id === action.payload._id && i.size === action.payload.size
        )
          ? state.cart.map((i) =>
              i._id === action.payload._id && i.size === action.payload.size
                ? {
                    ...i,
                    quantity: action.payload.quantity + i.quantity,
                  }
                : i
            )
          : [...state.cart, action.payload],
      };
    case "updateQuantity":
      return {
        ...state,
        cart: state.cart.map((i) =>
          i._id === action.payload._id && i.size === action.payload.size
            ? action.payload
            : i
        ),
      };
    case "removeProduct":
      return {
        ...state,
        cart: state.cart.filter(i => i._id !== action.payload.id || i.size !== action.payload.size)
      }
    case "addBillingAddress":
      return {
        ...state,
        billingAddress: action.payload
      }
    case "orderComplete":
      return {
        ...state,
        cart: [],
      }
    default:
      return state;
  }
};
