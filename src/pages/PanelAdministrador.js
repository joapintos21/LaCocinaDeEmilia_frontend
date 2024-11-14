import React from "react";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import tw from "twin.macro";
import Header from "components/headers/light.js";
import Footer from "components/footers/FiveColumnWithInputForm.js";
import { Box, Container, Typography, Paper, Grid, Button } from '@mui/material';
import Dashboard from "components/AdminPanel/Dashboard"; // Asegúrate de que el path sea correcto
import ProductManagement from "components/AdminPanel/ProductManagement"; // Asegúrate de que el path sea correcto
import CustomerManagement from "components/AdminPanel/CustomerManagement"; // Asegúrate de que el path sea correcto
import CategoryManagement from "components/AdminPanel/CategoryManagement";
import OrderManagement from "components/AdminPanel/OrderManagement";

export default () => {
  const HighlightedText = tw.span`bg-[#99cdb6] text-gray-100 px-4 transform -skew-x-12 inline-block`;

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
              <CategoryManagement />
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

            {/* Gestión de Clientes Section */}
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
                Gestión de Clientes
              </Typography>
              <CustomerManagement />
            </Paper>
          </Container>
        </Box>
      </Box>
      <Footer />
    </AnimationRevealPage>
  );
};
