import { Typography } from "@mui/material";
import type { NextPage } from "next";
import { ShopLayout } from "../components/layouts/ShopLayout";
import { ProductList } from "../components/products";
import { Loading } from "../components/ui";
import { useProducts } from "../hooks";

const Home: NextPage = () => {

  const {products, loading } = useProducts('/products')

  return (
    <ShopLayout
      title="Teslo Shop - Home"
      pageDescription="Encuentra los mejores productos de Teslo aqui"
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos
      </Typography>
      {
        loading ? (
          <Loading/>
        ) : (
          <ProductList products={products} />
        )
      }
    </ShopLayout>
  );
};

export default Home;
