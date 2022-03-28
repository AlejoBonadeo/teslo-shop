import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { GetServerSideProps } from 'next'
import { getSession } from "next-auth/react";
import NextLink from "next/link";
import { FC } from "react";
import { ShopLayout } from "../../components/layouts";
import { dbOrders } from "../../database";
import { Order } from "../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "fullName", headerName: "Nombre Completo", width: 300 },
  { 
    field: "paid", 
    headerName: "Pago", 
    width: 200, 
    renderCell: (params: GridValueGetterParams) =>  (
        <Chip
          color={params.row.paid ? 'success': 'error'}
          label={params.row.paid ? 'Pagada': 'No pagada'}
          variant="outlined"
        />
    )
  },
  {
    field: 'link',
    headerName: 'Ver orden',
    width: 200,
    renderCell: (params: GridValueGetterParams) => (
        <NextLink href={`/orders/${params.row.id}`} passHref>
          <Link underline="always">
            Ver orden
          </Link>
        </NextLink>
    ),
    sortable: false,
  }
];

interface Props {
  orders: Order[]
}


const History: FC<Props> = ({orders}) => {
  return (
    <ShopLayout
      title="Historial de Órdenes"
      pageDescription="Historial de Órdenes"
    >
      <Typography variant="h1" component="h1">
        Historial de Órdenes
      </Typography>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={orders.map(order => ({
              ...order,
              id: order._id,
              paid: order.isPaid,
              fullName: `${order.billingAddress.firstName} ${order.billingAddress.lastName}`,
            }))}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({req}) => {

  const session: any = await getSession({req});

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?p=/orders/history`,
        permanent: false,
      }
    }
  }

  const orders = await dbOrders.getOrdersByUser(session.user._id);
  return {
    props: {
      orders,
    }
  }
}

export default History;
