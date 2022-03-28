import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { useEffect, useContext } from "react";
import { CartContext } from "../../context";
import { useRouter } from "next/router";
import { Loading } from "../../components/ui";

const Cart = () => {
  const { isLoaded, cart } = useContext(CartContext);
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace("/cart/empty");
    }
  }, [isLoaded, cart]);

  if (!isLoaded || cart.length === 0) {
    return (
      <ShopLayout title="Loading" pageDescription="...">
        <Loading />
      </ShopLayout>
    );
  }

  return (
    <ShopLayout
      title="Carrito - 3"
      pageDescription="Carrito de compras de la tiends"
    >
      <Typography variant="h1" component="h1">
        Carrito
      </Typography>
      <Grid container marginTop={2}>
        <Grid item xs={12} sm={7}>
          <CartList canEdit items={cart}/>
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Orden</Typography>
              <Divider sx={{ my: 1 }} />
              <OrderSummary items={cart} />
              <Box sx={{ mt: 3 }}>
                <Button color="secondary" className="circular-btn" fullWidth href="/checkout/address">
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default Cart;
