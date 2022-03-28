import { ValidSizes } from ".";

export interface CartProduct {
    _id: string
    image: string;
    price: number;
    size?: ValidSizes;
    slug: string;
    title: string;
    gender: 'men'|'women'|'kid'|'unisex';
    quantity: number;
}

export interface BillingAddress {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
}
