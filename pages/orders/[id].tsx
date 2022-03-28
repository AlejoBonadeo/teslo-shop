import { GetServerSideProps, NextPage } from "next";
import NextLink from "next/link";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { Order } from "../../interfaces";
import { countries } from "../../utils";
import { ValidSizes } from "../../interfaces/Product";

interface Props {
  order: Order;
}

const Order: NextPage<Props> = ({ order }) => {
  const { billingAddress } = order;

  return (
    <ShopLayout
      title={`Resumen de orden ${order._id}`}
      pageDescription="Resumen de la orden"
    >
      <Typography variant="h1" component="h1">
        Orden: {order._id}
      </Typography>
      {order.isPaid ? (
        <Chip
          sx={{ my: 2 }}
          label="Pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{ my: 2 }}
          label="Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}
      <Grid container marginTop={2} className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList
            items={order.orderItems.map((item) => ({
              ...item,
              size: item.size as ValidSizes,
              gender: "unisex",
            }))}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2">
                Resumen({order.numberOfItems} producto
                {order.numberOfItems > 1 && "s"})
              </Typography>
              <Divider sx={{ my: 1 }} />

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
              <OrderSummary
                items={order.orderItems.map((item) => ({
                  ...item,
                  size: item.size as ValidSizes,
                  gender: "unisex",
                }))}
              />
              <Box sx={{ mt: 3 }} display="flex" flexDirection="column">
                {
                  order.isPaid ? (
                    <Chip
                      sx={{my:2}}
                      label="La orden ya fue pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <h1>Pagar</h1>
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;
  const session: any = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/${id}`,
        permanent: false,
      },
    };
  }
  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  if (order.user !== session.user?._id) {
    return {
      redirect: {
        destination: `/orders/history`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      order,
    },
  };
};

export default Order;
