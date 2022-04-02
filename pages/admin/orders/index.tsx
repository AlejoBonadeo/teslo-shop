import { ConfirmationNumberOutlined } from "@mui/icons-material";
import { Chip, Grid } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import useSWR from "swr";
import { AdminLayout } from "../../../components/layouts";
import { Loading } from "../../../components/ui";
import { Order, User } from "../../../interfaces";

const columns: GridColDef[] = [
  { field: "id", headerName: "Orden ID", width: 250 },
  { field: "email", headerName: "Correo", width: 250 },
  { field: "name", headerName: "Nombre", width: 300 },
  { field: "total", headerName: "Total", width: 300 },
  {
    field: "isPaid",
    headerName: "Pagado",
    renderCell: ({ row }: GridValueGetterParams) => {
      return row.isPaid ? (
        <Chip variant="outlined" label="Pagado" color="success" />
      ) : (
        <Chip variant="outlined" label="Pendiente" color="error" />
      );
    },
    width: 150
  },
  { field: "numberOfItems", headerName: "No. Productos", align: "center" },
  {
      field: "check",
      headerName: "Ver Orden",
      renderCell: ({ row }: GridValueGetterParams) => {
          return (
              <a href={`/admin/orders/${row.id}`} target="_blank" rel="noreferrer">
              Ver Orden
          </a>
      )
    },
},
{ field: "createdAt", headerName: "Creada En", align: "center", width: 300 },
];

const Orders = () => {
  
  const {data, error} = useSWR<Order[]>("/api/admin/orders");

  if(!data && !error) return <Loading />;

  const rows = data!.map(order => ({
    ...order,
    id: order._id,
    email: (order.user as User).email,
    name: (order.user as User).name,
  }))

  return (
    <AdminLayout
      title="Ordenes"
      subtitle="Mantenimiento de ordenes"
      icon={<ConfirmationNumberOutlined />}
    >
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default Orders;
