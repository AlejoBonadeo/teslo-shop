import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context";
import { countries } from "../../utils";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Summary = () => {
  const { billingAddress, createOrder, cart } = useContext(CartContext);
  const router = useRouter();

  const [creatingOrder, setCreatingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!Cookies.get("firstName")) {
      router.push("/checkout/address");
    }
  }, [router]);

  const onCreateOrder = async () => {
    setCreatingOrder(true);
    const { message, ok } = await createOrder();
    if(!ok) {
      setCreatingOrder(false);
      setErrorMessage(message);
    } else {
      router.push(`/orders/${message}`);
    }
    
  };

  if (!billingAddress) return <></>;

  return (
    <ShopLayout title="Resumen de orden" pageDescription="Resumen de la orden">
      <Typography variant="h1" component="h1">
        Resumen de la orden
      </Typography>
      <Grid container marginTop={2}>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">Resumen(3 productos)</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="flex-end">
                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <Typography variant="subtitle1">Dirección de entrega</Typography>
              <Typography>
                {billingAddress.firstName} {billingAddress.lastName}
              </Typography>
              <Typography>
                {billingAddress.address} {billingAddress.address2}
              </Typography>
              <Typography>
                {billingAddress.city}, {billingAddress.zip}
              </Typography>
              <Typography>
                {
                  countries.find(
                    (country) => country.code === billingAddress.country
                  )!.name
                }
              </Typography>
              <Typography>{billingAddress.phone}</Typography>
              <Divider sx={{ my: 1 }} />
              <Box display="flex" justifyContent="flex-end">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>
              <OrderSummary />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column" >
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={onCreateOrder}
                  disabled={!cart.length || creatingOrder}
                >
                  Confirmar Orden
                </Button>
                {
                  errorMessage && (
                    <Chip color="error" label={errorMessage} sx={{ mt: 1 }} className="fadeIn" />
                  )
                }
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default Summary;
