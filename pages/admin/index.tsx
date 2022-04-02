import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from "@mui/icons-material";
import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { SummaryTitle } from "../../components/admin";
import { AdminLayout } from "../../components/layouts";
import { Loading } from "../../components/ui";
import { DashboardResponse } from "../../interfaces";

const DashboardPage = () => {

  const { data, error } = useSWR<DashboardResponse>('/api/admin/dashboard', {
    refreshInterval: 30000,
  });
  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshIn(refreshIn => refreshIn > 0 ? refreshIn - 1 : 30);
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);
  

  if(error) return <div>{error.message}</div>
  
  if(!data) return <Loading/>


  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Estadisticas generales"
      icon={<DashboardOutlined />}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTitle
            icon={<CreditCardOffOutlined color="secondary" sx={{fontSize: 40}} />}
            subtitle="Ordenes Totales"
            title={data.numberOfOrders}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTitle
            icon={<AttachMoneyOutlined color="success" sx={{fontSize: 40}} />}
            subtitle="Ordenes Pagadas"
            title={data.paidOrders}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTitle
            icon={<CreditCardOffOutlined color="error" sx={{fontSize: 40}} />}
            subtitle="Ordenes Pendientes"
            title={data.unpaidOrders}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTitle
            icon={<GroupOutlined color="primary" sx={{fontSize: 40}} />}
            subtitle="Clientes"
            title={data.numberOfUsers}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTitle
            icon={<CategoryOutlined color="warning" sx={{fontSize: 40}} />}
            subtitle="Productos"
            title={data.numberOfProducts}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTitle
            icon={<CancelPresentationOutlined color="error" sx={{fontSize: 40}} />}
            subtitle="Sin Stock"
            title={data.productsWithNoStock}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTitle
            icon={<ProductionQuantityLimitsOutlined color="warning" sx={{fontSize: 40}} />}
            subtitle="Bajo Stock"
            title={data.productsWithLowStock}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={3}>
          <SummaryTitle
            icon={<AccessTimeOutlined    color="secondary" sx={{fontSize: 40}} />}
            subtitle="Actualizacion en: "
            title={refreshIn}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default DashboardPage;
