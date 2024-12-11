import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import { Box, Grid, Paper, Typography } from "@mui/material";
import Dashboard from "components/AdminPanel/Dashboard";
import ProductManagement from "components/AdminPanel/ProductManagement";
import UserManagement from "components/AdminPanel/UserManagement";
import CategoryManagement from "components/AdminPanel/CategoryManagement";
import OrderManagement from "components/AdminPanel/OrderManagement";
import DiscountManagement from "components/AdminPanel/DiscountManagement";
import PermissionsManagement from "components/AdminPanel/PermissionsManagement";
import AdditionalManagement from "components/AdminPanel/AdditionalManagement";
import Header from "components/headers/light.js";

export default () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const categoriasRedux = useSelector((state) => state.categorias);

  useEffect(() => {
    if (Array.isArray(categoriasRedux) && categoriasRedux.length > 0) {
      const transformedCategories = categoriasRedux.map((categoria) => ({
        imageSrc:
          categoria.imageUrl ||
          "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
        title: categoria.titulo || "Sin nombre",
        description: categoria.descripcion || "Sin descripción",
        url: "#",
      }));
      setCategories(transformedCategories);
    } else {
      setCategories([]); // En caso de que no haya datos, inicializa como un array vacío
    }
  }, [categoriasRedux]);

  const modules = [
    { title: "Dashboard", component: <Dashboard /> },
    { title: "Gestión de Pedidos", component: <OrderManagement /> },
    { title: "Gestión de Categorías", component: <CategoryManagement /> },
    { title: "Gestión de Productos", component: <ProductManagement /> },
    { title: "Gestión de Adicionales de Productos", component: <AdditionalManagement /> },
    { title: "Gestión de Descuentos", component: <DiscountManagement /> },
    //{ title: "Gestión de Usuarios", component: <UserManagement /> },
    //{ title: "Gestión de Permisos", component: <PermissionsManagement /> }
  ];

  return (
    <AnimationRevealPage>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          bgcolor: "#f5f5f5",
          padding: 3,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "#333",
            fontWeight: "bold",
            marginBottom: 4,
          }}
        >
          Panel de Administrador
        </Typography>

        <Grid container spacing={4}>
          {modules.map((module, index) => (
            <Grid item xs={12} key={index}>
              <Paper
                sx={{
                  padding: 3,
                  boxShadow: 3,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "#333", fontWeight: "600" }}
                >
                  {module.title}
                </Typography>
                {module.component}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </AnimationRevealPage>
  );
};
