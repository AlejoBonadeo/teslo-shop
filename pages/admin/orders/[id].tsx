import { GetServerSideProps, NextPage } from "next";
import {
  CreditCardOffOutlined,
  CreditScoreOutlined,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { CartList, OrderSummary } from "../../../components/cart";
import { AdminLayout } from "../../../components/layouts";
import { dbOrders } from "../../../database";
import { Order, ValidSizes } from "../../../interfaces";
import { countries } from "../../../utils";

interface Props {
  order: Order;
}

const Order: NextPage<Props> = ({ order }) => {
  const { billingAddress } = order;

  return (
    <AdminLayout
      title={`Resumen de orden`}
      subtitle={`Orden ID: ${order._id}`}
    >
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
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query;

  const order = await dbOrders.getOrderById(id.toString());

  if (!order) {
    return {
      redirect: {
        destination: "/admin/orders",
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
