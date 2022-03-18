import useSWR, { SWRConfiguration } from "swr";
import { Product } from "../interfaces";

export const useProducts = (url: string, config?: SWRConfiguration) => {
  const { data, error } = useSWR<Product[]>(`/api${url}`, config);

  return {
    products: data || [],
    loading: !error && !data,
    error, 
  };
};
