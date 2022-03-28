import { User, BillingAddress } from ".";

export interface Order {
  _id?: string;
  user?: User | string;
  orderItems: OrderItem[];
  billingAddress: BillingAddress
  paymentMethod?: string;
  numberOfItems: number;
  subTotal: number;
  tax: number;
  total: number;
  isPaid: boolean;
  piadAt?: string;
}

export interface OrderItem {
  _id: string;
  title: string;
  size: string;
  quantity: number;
  slug: string;
  image: string;
  price: number;
}