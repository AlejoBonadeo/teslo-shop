import { GetServerSideProps, NextPage } from "next";
import { Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { dbProducts } from "../../database";
import { Product } from "../../interfaces";

interface Props {
  products: Product[];
  foundProducts: boolean;
  query: string;
}

const Search: NextPage<Props> = ({products, query, foundProducts}) => {

  return (
    <ShopLayout
      title="Teslo Shop - Buscar"
      pageDescription="Encuentra los mejores productos de Teslo aqui"
    >
      <Typography variant="h1" component="h1">
        Buscar Productos
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        {foundProducts ? 'Se muestran ' : 'No hay '}resultados para {query}
      </Typography>
      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  
  const { query = ''} = params as {query:  string}

  let products = await dbProducts.getProductsByTerm(query);
  const foundProducts = !!products.length
  if(!products.length) {
      products = await dbProducts.getProductsByTerm('shirt')
  }

  return {
    props: {
        products,
        foundProducts,
        query
    },
  };
};

export default Search;
