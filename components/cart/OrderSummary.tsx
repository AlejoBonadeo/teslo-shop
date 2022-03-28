import { Grid, Typography } from "@mui/material";
import { FC, useMemo } from 'react';
import { CartProduct } from "../../interfaces";
import { formatCurrency } from '../../utils/currency';

interface Props {
  items: CartProduct[];
}

export const OrderSummary: FC<Props> = ({items}) => {

  const quantity = useMemo(() => items.reduce((acc, i) => acc + i.quantity, 0), [items])
  const subTotal = useMemo(() => items.reduce((acc, i) => acc + i.quantity * i.price, 0), [items])
  const tax = useMemo(() => subTotal * .15, [subTotal])
  const total = useMemo(() => subTotal + tax, [subTotal, tax])

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{quantity}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{formatCurrency(subTotal)}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography>Impuestos(15%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{formatCurrency(tax)}</Typography>
      </Grid>
      <Grid item xs={6} sx={{mt: 2}}>
        <Typography variant="subtitle1">Total a pagar</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{mt: 2}}>
        <Typography variant="subtitle1">{formatCurrency(total)}</Typography>
      </Grid>
    </Grid>
  );
};
