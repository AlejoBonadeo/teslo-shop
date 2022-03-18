import { Box, Button, Grid, Link, TextField, Typography } from "@mui/material";
import NextLink from "next/link";
import { AuthLayout } from "../../components/layouts";

const Register = () => {
  return (
    <AuthLayout title="Registrarse">
      <Box sx={{width: 350, padding: '10px 20px',}}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h1" component="h1">
              Registrarse
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Nombre" variant="filled" fullWidth/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Correo" variant="filled" fullWidth/>
          </Grid>
          <Grid item xs={12}>
            <TextField label="Contraseña" type="password" variant="filled" fullWidth/>
          </Grid>
          <Grid item xs={12}>
            <Button color="secondary" className="circular-btn" fullWidth size="large">
              Ingresar
            </Button>
          </Grid>
          <Grid item xs={12}>
            <NextLink href="/auth/login" passHref>
              <Link underline="always">
                ¿Ya tienes cuenta?
              </Link>
            </NextLink>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
};

export default Register;