import { Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import { FC } from "react";
import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { Product } from "../../interfaces";

interface Props {
  products: Product[];
  category: 'men' | 'women' | 'kid' | 'unisex'
}

const Category: FC<Props> = ({ products, category }) => {
  return (
    <ShopLayout
      title={`Teslo Shop - ${category}`}
      pageDescription="Encuentra los mejores productos de Teslo aqui"
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Productos para { category }
      </Typography>
      <ProductList products={products} />
    </ShopLayout>
  );
};

export const getStaticPaths: GetStaticPaths = async ctx => {
  return {
    paths: [
      {
        params: {
          category: "men",
        },
      },
      {
        params: {
          category: "women",
        },
      },
      {
        params: {
          category: "kid",
        },
      },
      {
        params: {
          category: "unisex",
        },
      },
    ],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = await fetch(
    `http://localhost:3000/api/products?gender=${params!.category}`
  );
  const body = await response.json();

  if (body.message) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        products: body,
        category: params!.category
      },
    };
  }
};

export default Category;
