import { NextPage, GetStaticPaths, GetStaticProps } from "next";
import { Box, Button, Chip, Grid, Typography } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { SizeSelector, Slideshow } from "../../components/products";
import { ItemCounter } from "../../components/ui";
import { Product } from "../../interfaces";
import { dbProducts } from "../../database";
import { useState, useContext } from 'react';
import { CartProduct } from "../../interfaces";
import { CartContext } from "../../context";
import { useRouter } from "next/router";

interface Props {
  product: Product;
}

const Products: NextPage<Props> = ({ product }) => {
  const [tempCartProduct, setTempCartProduct] = useState<CartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });
  

  const {addProduct} = useContext(CartContext);

  const router = useRouter()

  const addOne = () => {
    tempCartProduct.quantity !== product.inStock &&
      setTempCartProduct({
        ...tempCartProduct,
        quantity: tempCartProduct.quantity + 1,
      });
  };
  const removeOne = () => {
    tempCartProduct.quantity !== 1 &&
      setTempCartProduct({
        ...tempCartProduct,
        quantity: tempCartProduct.quantity - 1,
      });
  };

  const addToCart = () => {
    if(!tempCartProduct.size) return;
    addProduct(tempCartProduct)
    router.push('/cart')
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <Slideshow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>
            {!!product.inStock && (
              <Box sx={{ my: 2 }}>
                <Typography variant="subtitle2">Cantidad</Typography>
                <ItemCounter
                  quantity={tempCartProduct.quantity}
                  addOne={addOne}
                  removeOne={removeOne}
                />
                <SizeSelector
                  selectedSize={tempCartProduct.size}
                  sizes={product.sizes}
                  setTempCartProduct={setTempCartProduct}
                />
              </Box>
            )}
            {product.inStock ? (
              <Button color="secondary" className="circular-btn" onClick={addToCart}>
                {tempCartProduct.size
                  ? "Agregar al carrito"
                  : "Seleccione una talla"}
              </Button>
            ) : (
              <Chip
                label="No hay disponibles"
                color="error"
                variant="outlined"
              />
            )}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes
export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const slugs = await dbProducts.getAllProductsSlug();

  return {
    paths: slugs.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const product = await dbProducts.getProductBySlug(params!.slug as string);

  if (!product) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24,
  };
};

export default Products;
