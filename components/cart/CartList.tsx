import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { FC, useContext } from "react";
import { CartContext } from "../../context";
import { CartProduct, OrderItem } from "../../interfaces";
import { ItemCounter } from "../ui";

interface Props {
  canEdit?: boolean;
  items: CartProduct[];
}

export const CartList: FC<Props> = ({ canEdit = false, items }) => {
  const { cart, updateQuantity, removeProduct} = useContext(CartContext);

  return (
    <>
      {items.map((product) => (
        <Grid
          container
          spacing={2}
          key={product.slug + product.size}
          sx={{ mb: 1 }}
        >
          <Grid item xs={3}>
            <NextLink href={`/products/${product.slug}`} passHref>
              <Link>
                <CardActionArea>
                  <CardMedia
                    image={product.image}
                    component="img"
                    sx={{ borderRadius: "5px", overflow: "hidden" }}
                  />
                </CardActionArea>
              </Link>
            </NextLink>
          </Grid>
          <Grid item xs={7}>
            <Box display="flex" flexDirection="column">
              <Typography variant="body1">{product.title}</Typography>
              <Typography variant="body1">
                Talle: <strong>{product.size}</strong>
              </Typography>
              {canEdit ? (
                <ItemCounter
                  quantity={product.quantity}
                  addOne={() => {
                    if (product.quantity === 10) return;
                    updateQuantity({...product, quantity: product.quantity + 1});
                  }}
                  removeOne={() => {
                    if (product.quantity === 1) return;
                    updateQuantity({...product, quantity: product.quantity - 1});
                  }}
                />
              ) : (
                <Typography variant="h5">
                  {product.quantity} producto{product.quantity > 1 && "s"}
                </Typography>
              )}
            </Box>
          </Grid>
          <Grid
            item
            xs={2}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="subtitle1">
              ${product.price * product.quantity}
            </Typography>
            {canEdit && (
              <Button variant="text" color="secondary" onClick={() => removeProduct(product._id, product.size!)}>
                Remover
              </Button>
            )}
          </Grid>
        </Grid>
      ))}
    </>
  );
};
