import { createContext, FC, useReducer, useEffect } from "react";
import Cookie from "js-cookie";
import { cartReducer } from ".";
import { BillingAddress, CartProduct, Order, ValidSizes } from "../../interfaces";
import { tesloApi } from "../../api/tesloApi";
import axios from "axios";

interface CartContextProps {
  cart: CartProduct[];
  isLoaded: boolean;
  billingAddress?: BillingAddress;
  addProduct: (product: CartProduct) => void;
  updateQuantity: (product: CartProduct) => void;
  removeProduct: (id: string, size: ValidSizes) => void;
  addBillingAddress: (address: BillingAddress) => void;
  createOrder: () => Promise<{message: string, ok: boolean}>;
}

export const CartContext = createContext({} as CartContextProps);

export interface CartState {
  cart: CartProduct[];
  billingAddress?: BillingAddress;
  isLoaded: boolean;
}

const CART_INIT_STATE: CartState = {
  cart: [],
  isLoaded: false,
};

export const CartProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, CART_INIT_STATE);

  useEffect(() => {
    try {
      dispatch({
        type: "loadCart",
        payload: JSON.parse(Cookie.get("cart") || "[]"),
      });
    } catch (error) {
      dispatch({
        type: "loadCart",
        payload: [],
      });
    }
  }, []);

  useEffect(() => {
    if (!Cookie.get("firstName")) return;
    addBillingAddress({
      firstName: Cookie.get("firstName") || "",
      lastName: Cookie.get("lastName") || "",
      phone: Cookie.get("phone") || "",
      address: Cookie.get("address") || "",
      address2: Cookie.get("address2") || "",
      city: Cookie.get("city") || "",
      zip: Cookie.get("zip") || "",
      country: Cookie.get("country") || "",
    });
  }, []);

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart));
  }, [state.cart]);

  const addProduct = (product: CartProduct) => {
    dispatch({ type: "addProduct", payload: product });
  };

  const updateQuantity = (product: CartProduct) => {
    dispatch({ type: "updateQuantity", payload: product });
  };

  const removeProduct = (id: string, size: ValidSizes) => {
    dispatch({ type: "removeProduct", payload: { id, size } });
  };

  const addBillingAddress = (billingAddress: BillingAddress) => {
    dispatch({ type: "addBillingAddress", payload: billingAddress });
  };

  const createOrder = async (): Promise<{message: string, ok: boolean}> => {
    if(!state.billingAddress) {
      return {
        ok: false,
        message: "No se ha agregado la dirección de facturación"
      }
    }

    const order: Order = {
      billingAddress: state.billingAddress,
      orderItems: state.cart.map((product) => ({
        _id: product._id,
        size: product.size!,
        quantity: product.quantity,
        title: product.title,
        price: product.price,
        slug: product.slug,
        image: product.image,
      })),
      numberOfItems: state.cart.reduce((acc, i) => acc + i.quantity, 0),
      subTotal: state.cart.reduce((acc, i) => acc + i.quantity * i.price, 0),
      tax: state.cart.reduce((acc, i) => acc + i.quantity * i.price, 0) * .15,
      total: state.cart.reduce((acc, i) => acc + i.quantity * i.price, 0) * 1.15,
      isPaid: false,
    }

    try {
      const { data } = await tesloApi.post<Order>("/orders", order);

      dispatch({type: "orderComplete"})

      return {
        ok: true,
        message: data._id!,
      }

    } catch (error) {
      if(axios.isAxiosError(error)) {
        return {
          ok: false,
          message: error.response?.data.message,
        }
      } else {
        return {
          ok: false,
          message: "Error al crear la orden",
        }
      }
    }
  };

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProduct,
        updateQuantity,
        removeProduct,
        addBillingAddress,
        createOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
