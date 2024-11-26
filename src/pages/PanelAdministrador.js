import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';
import Dashboard from "components/AdminPanel/Dashboard"; // Asegúrate de que el path sea correcto
import ProductManagement from "components/AdminPanel/ProductManagement"; // Asegúrate de que el path sea correcto
import UserManagement from "components/AdminPanel/UserManagement"; // Asegúrate de que el path sea correcto
import CategoryManagement from "components/AdminPanel/CategoryManagement";
import OrderManagement from "components/AdminPanel/OrderManagement";
import { obtenerCategorias } from 'scripts/obtenerCategorias';
import DiscountManagement from "components/AdminPanel/DiscountManagement";
import PermissionsManagement from "components/AdminPanel/PermissionsManagement";

export default () => {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  const categoriasRedux = useSelector((state) => state.categorias); // Obtener las categorías de Redux si ya están almacenadas

  useEffect(() => {
    if (categoriasRedux && categoriasRedux.length > 0) {
      const transformedCategories = categoriasRedux.map((categoria) => ({
        imageSrc: categoria.imageUrl || "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80", // Usa una URL por defecto si no hay `imageUrl`
        title: categoria.titulo || "Sin nombre",
        description: categoria.descripcion || "Sin descripción",
        url: '#'
      }));
      setCategories(transformedCategories);
    }
  }, [categoriasRedux]);

  return (
    <AnimationRevealPage>
      <Header />
      <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>

        {/* Contenido principal sin el Sidebar */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "#f5f5f5",
            padding: 3,
            marginTop: 8,  // Esto asegura que el contenido no se superponga con la AppBar
          }}
        >
          {/* Título del panel de administración */}
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              textAlign: 'center',
              color: "#333",
              fontWeight: 'bold',
              marginBottom: 4,
            }}
          >
            Panel de Administrador
          </Typography>

          {/* Contenedor de contenido */}
          <Container maxWidth="lg">
            {/* Dashboard Section */}
            <Paper
              sx={{
                padding: 4,
                marginBottom: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#333", fontWeight: '600' }}
              >
                Dashboard
              </Typography>
              <Dashboard />
            </Paper>

            {/* Gestión de Pedidos Section */}
            <Paper
              sx={{
                padding: 4,
                marginBottom: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#333", fontWeight: '600' }}
              >
                Gestión de Pedidos
              </Typography>
              <OrderManagement />
            </Paper>

            {/* Gestión de Categorías Section */}
            <Paper
              sx={{
                padding: 4,
                marginBottom: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#333", fontWeight: '600' }}
              >
                Gestión de Categorías
              </Typography>
              <CategoryManagement 
              categories={categories} />
            </Paper>

            {/* Gestión de Productos Section */}
            <Paper
              sx={{
                padding: 4,
                marginBottom: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#333", fontWeight: '600' }}
              >
                Gestión de Productos
              </Typography>
              <ProductManagement />
            </Paper>

            {/* Gestión de Descuentos Section */}
            <Paper
              sx={{
                padding: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#333", fontWeight: '600' }}
              >
                Gestión de Descuentos
              </Typography>
              <DiscountManagement />
            </Paper>

            {/* Gestión de Usuarios Section */}
            <Paper
              sx={{
                padding: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#333", fontWeight: '600' }}
              >
                Gestión de Usuarios
              </Typography>
              <UserManagement />
            </Paper>

            {/* Gestión de Permisos Section */}
            <Paper
              sx={{
                padding: 4,
                boxShadow: 3,
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "#333", fontWeight: '600' }}
              >
                Gestión de Permisos de Usuario
              </Typography>
              <PermissionsManagement />
            </Paper>
          </Container>
        </Box>
      </Box>
    </AnimationRevealPage>
  );
};
