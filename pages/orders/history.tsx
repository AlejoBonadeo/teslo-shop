import { Chip, Grid, Link, Typography } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import { ShopLayout } from "../../components/layouts";

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

const rows = [
  { id: 1, fullName: "Alejo Bonadeo", paid: false },
  { id: 2, fullName: "Alejo Bonadeo", paid: true },
  { id: 3, fullName: "Alejo Bonadeo", paid: true },
  { id: 4, fullName: "Alejo Bonadeo", paid: true },
  { id: 5, fullName: "Alejo Bonadeo", paid: false },
  { id: 6, fullName: "Alejo Bonadeo", paid: true },
  { id: 7, fullName: "Alejo Bonadeo", paid: true },
];

const History = () => {
  return (
    <ShopLayout
      title="Historial de Órdenes"
      pageDescription="Historial de Órdenes"
    >
      <Typography variant="h1" component="h1">
        Historial de Órdenes
      </Typography>
      <Grid container>
        <Grid item xs={12} sx={{ height: 650, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

export default History;
