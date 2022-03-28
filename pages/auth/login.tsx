import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { GetServerSideProps } from "next";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { AuthLayout } from "../../components/layouts";
import { ErrorOutline } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getSession, signIn, getProviders } from "next-auth/react";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showError, setShowError] = useState(false);
  const [providers, setProviders] = useState<any>({});

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const router = useRouter();

  const onLogin = async ({ email, password }: FormData) => {
    setShowError(false);

    await signIn("credentials", { email, password });

    // const isValidLogin = await login(email, password);
    // if (!isValidLogin) {
    //   setShowError(true);
    //   setTimeout(() => setShowError(false), 3000);
    //   return;
    // }
    // const destination = router.query.p?.toString() || "/";
    // router.replace(destination);
  };

  return (
    <AuthLayout title="Ingresar">
      <form onSubmit={handleSubmit(onLogin)} noValidate>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar Sesión
              </Typography>
              {showError && (
                <Chip
                  label="No reconocemos ese usuario / contraseña"
                  color="error"
                  icon={<ErrorOutline />}
                  className="fadeIn"
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "El correo es requerido",
                })}
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
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
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
                href={`/auth/register${
                  router.query.p?.toString() ? "?p=" : ""
                }${router.query.p?.toString() || ""}`}
                passHref
              >
                <Link underline="always">¿No tienes cuenta?</Link>
              </NextLink>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="flex-end"
              flexDirection="column"
            >
              <Divider sx={{ width: "100%", mb: 2 }} />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === "credentials") return null;
                return (
                  <Button
                    key={provider.id}
                    variant="outlined"
                    fullWidth
                    color="primary"
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

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

export default Login;
