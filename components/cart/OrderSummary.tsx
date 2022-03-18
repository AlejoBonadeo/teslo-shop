import { Grid, Typography } from "@mui/material";

export const OrderSummary = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>3</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>$200</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuestos(15%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>$30</Typography>
      </Grid>
      <Grid item xs={6} sx={{mt: 2}}>
        <Typography variant="subtitle1">Total a pagar</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{mt: 2}}>
        <Typography variant="subtitle1">$230</Typography>
      </Grid>
    </Grid>
  );
};
