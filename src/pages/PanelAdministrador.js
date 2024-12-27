import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemText, Typography, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Dashboard from 'components/AdminPanel/Dashboard';
import ProductManagement from 'components/AdminPanel/ProductManagement';
import UserManagement from 'components/AdminPanel/UserManagement';
import CategoryManagement from 'components/AdminPanel/CategoryManagement';
import DiscountManagement from 'components/AdminPanel/DiscountManagement';
import PermissionsManagement from 'components/AdminPanel/PermissionsManagement';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const modules = [
    { title: "Dashboard", component: <Dashboard /> },
    { title: "Gestión de Categorías", component: <CategoryManagement /> },
    { title: "Gestión de Productos", component: <ProductManagement /> },
    { title: "Gestión de Descuentos", component: <DiscountManagement /> },
    { title: "Gestión de Usuarios", component: <UserManagement /> },
    { title: "Gestión de Permisos", component: <PermissionsManagement /> },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar para encabezado */}
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Panel de Administrador
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Menú lateral */}
      <Drawer
        variant="persistent"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box role="presentation">
          <List>
            {modules.map((module, index) => (
              <ListItem
                button
                key={index}
                onClick={() => {
                  setActiveSection(module.title);
                  setIsDrawerOpen(false); // Cerrar el menú en dispositivos móviles
                }}
              >
                <ListItemText primary={module.title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: isDrawerOpen ? '240px' : '0',
          transition: 'margin 0.3s ease-in-out',
        }}
      >
        {/* Espaciador para que el contenido no quede oculto debajo de la AppBar */}
        <Toolbar />
        <Typography variant="h4" gutterBottom>
          {activeSection}
        </Typography>
        {modules.find((module) => module.title === activeSection)?.component}
      </Box>
    </Box>
  );
};

export default AdminPanel;
