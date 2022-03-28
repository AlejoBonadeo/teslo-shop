import { ErrorOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { getSession, signIn } from "next-auth/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layouts";
import { AuthContext } from "../../context";

type FormData = {
  name: string;
  email: string;
  password: string;
};

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [showError, setShowError] = useState("");
  const router = useRouter();

  const { register: registerUser } = useContext(AuthContext);

  const onRegister = async ({ email, name, password }: FormData) => {
    setShowError("");
    const error = await registerUser(email, name, password);
    if (error) {
      setShowError(error);
      setTimeout(() => setShowError(""), 3000);
      return;
    }
    // const destination = router.query.p?.toString() || "/";
    // router.replace(destination);
    await signIn("credentials", { email, password });
  };

  return (
    <AuthLayout title="Registrarse">
      <form onSubmit={handleSubmit(onRegister)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Registrarse
              </Typography>
              {showError && (
                <Chip
                  label={showError}
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre"
                variant="filled"
                fullWidth
                {...register("name", { required: "El nombre es requerido" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", { required: "El correo es requerido" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "La contraseña es requerida",
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                color="secondary"
                className="circular-btn"
                fullWidth
                size="large"
                type="submit"
              >
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12}>
              <NextLink
                href={`/auth/login${router.query.p?.toString() ? "?p=" : ""}${
                  router.query.p?.toString() || ""
                }`}
                passHref
              >
                <Link underline="always">¿Ya tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req });

  const { p = "/" } = query;
  if (session) {
    return {
      redirect: {
        destination: p.toString(),
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Register;
