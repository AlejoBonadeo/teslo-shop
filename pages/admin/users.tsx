import { PeopleOutline } from "@mui/icons-material";
import { AdminLayout } from "../../components/layouts";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { Grid, MenuItem, Select } from "@mui/material";
import useSWR from "swr";
import { Loading } from "../../components/ui";
import { User } from "../../interfaces";
import { tesloApi } from "../../api";
import { useState, useEffect } from "react";

const Users = () => {
  const { data, error } = useSWR<User[]>("/api/admin/users");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (!data && !error) return <Loading />;

  const onRoleUpdated = async (userId: string, newRole: string) => {
    const previousUsers = [...users];
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      )
    );
    try {
      await tesloApi.patch("/admin/users", { id: userId, role: newRole });
    } catch (error) {
      alert("Error updating role");
      setUsers(previousUsers);
    }
  };

  const rows = users.map((user) => ({
    ...user,
    id: user._id,
  }));

  const columns: GridColDef[] = [
    { field: "email", headerName: "Correo", width: 250 },
    { field: "name", headerName: "Nombre", width: 300 },
    {
      field: "role",
      headerName: "Rol",
      width: 300,
      renderCell: ({ row }: GridValueGetterParams) => {
        return (
          <Select
            value={row.role}
            label="Rol"
            onChange={(e) => {
              onRoleUpdated(row.id, e.target.value);
            }}
            sx={{ width: 300 }}
          >
            <MenuItem value="client">Client</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        );
      },
    },
  ];

  return (
    <AdminLayout
      title="Usuarios"
      subtitle="Mantenimiento de usuarios"
      icon={<PeopleOutline />}
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

export default Users;
