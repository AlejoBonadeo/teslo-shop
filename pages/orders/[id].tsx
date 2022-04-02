import { GetServerSideProps, NextPage } from "next";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { CartList, OrderSummary } from "../../components/cart";
import { ShopLayout } from "../../components/layouts/ShopLayout";
import { getSession } from "next-auth/react";
import { dbOrders } from "../../database";
import { Order, ValidSizes } from "../../interfaces";
import { countries } from "../../utils";
import { tesloApi } from "../../api";
import { useRouter } from "next/router";
import { useState } from "react";

interface Props {
  order: Order;
}

interface OrderResonseBody {
  id: string;
  status: string;
}

const Order: NextPage<Props> = ({ order }) => {
  const { billingAddress } = order;

  const [isPaying, setIsPaying] = useState(false);

  const router = useRouter();

  const onOrderCompleted = async (details: OrderResonseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("No se pudo completar la orden");
    }
    setIsPaying(true);
    try {
      await tesloApi.post("/orders/pay", {
        orderId: order._id,
        transactionId: details.id,
      });
      router.reload();
    } catch (error) {
      alert("Error");
      setIsPaying(false);
    }
  };

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
                {order.isPaid ? (
                  <Chip
                    sx={{ my: 2 }}
                    label="La orden ya fue pagada"
                    variant="outlined"
                    color="success"
                    icon={<CreditScoreOutlined />}
                  />
                ) : isPaying ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    className="fadeIn"
                  >
                    <CircularProgress />
                  </Box>
                ) : (
                  <PayPalButtons
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: `${order.total}`,
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then((details) => {
                        onOrderCompleted(details);
                      });
                    }}
                  />
                )}
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
