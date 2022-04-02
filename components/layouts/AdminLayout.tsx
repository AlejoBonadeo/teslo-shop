import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { FC } from "react";
import { AdminNavbar } from "../admin";
import { Sidebar } from "../ui";

interface Props {
  title: string;
  subtitle: string;
  icon?: JSX.Element;
}

export const AdminLayout: FC<Props> = ({ children, title, subtitle, icon }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <nav>
        <AdminNavbar />
      </nav>
      <Sidebar />
      <main
        style={{
          margin: "80px auto",
          maxWidth: "1440px",
          padding: "0 30px",
        }}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon}
            {title}
          </Typography>
          <Typography variant="h2" component="h2" sx={{ mb: 1 }}>
            {subtitle}
          </Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
      </main>
    </>
  );
};
