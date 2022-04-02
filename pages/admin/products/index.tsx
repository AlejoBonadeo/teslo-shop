import { AddOutlined, CategoryOutlined } from "@mui/icons-material";
import { Box, Button, CardMedia, Grid, Link } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import NextLink from "next/link";
import useSWR from "swr";
import { AdminLayout } from "../../../components/layouts";
import { Loading } from "../../../components/ui";
import { Product } from "../../../interfaces";

const columns: GridColDef[] = [
  {
    field: "img",
    headerName: "Foto",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <a href={`/products/${row.slug}`} target="_blank" rel="noreferrer">
          <CardMedia
            component="img"
            className="fadeIn"
            image={row.img}
            alt={row.title}
          />
        </a>
      );
    },
  },
  {
    field: "title",
    headerName: "Titulo",
    renderCell: ({ row }: GridValueGetterParams) => {
      return (
        <NextLink href={`/admin/products/${row.slug}`} passHref>
          <Link underline="always">{row.title}</Link>
        </NextLink>
      );
    },
    width: 300,
  },
  { field: "gender", headerName: "Genero" },
  { field: "type", headerName: "Tipo" },
  { field: "inStock", headerName: "Stock" },
  { field: "price", headerName: "Precio" },
  { field: "sizes", headerName: "Talles", width: 250 },
];

const Products = () => {
  const { data, error } = useSWR<Product[]>("/api/admin/products");

  if (!data && !error) return <Loading />;

  const rows = data!.map((product) => ({
    ...product,
    id: product._id,
    img: product.images[0],
    sizes: product.sizes.join(", "),
  }));

  return (
    <AdminLayout
      title={"Productos  (" + data!.length + ")"}
      subtitle="Mantenimiento de  productos"
      icon={<CategoryOutlined />}
    >
      <Box display="flex" justifyContent="flex-end" sx={{ mb: 2 }}>
        <Button
          startIcon={<AddOutlined/>}
          color="secondary"
          href="/admin/products/new"
        >
          Crear Producto
        </Button>
      </Box>
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

export default Products;
