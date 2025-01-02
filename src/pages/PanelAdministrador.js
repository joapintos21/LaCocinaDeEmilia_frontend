import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { Box, Grid, Paper, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import Dashboard from 'components/AdminPanel/Dashboard';
import ProductManagement from 'components/AdminPanel/ProductManagement';
import UserManagement from 'components/AdminPanel/UserManagement';
import CategoryManagement from 'components/AdminPanel/CategoryManagement';
import OrderManagement from 'components/AdminPanel/OrderManagement';
import DiscountManagement from 'components/AdminPanel/DiscountManagement';
import PermissionsManagement from 'components/AdminPanel/PermissionsManagement';
import AdditionalManagement from 'components/AdminPanel/AdditionalManagement';
import Header from 'components/headers/light.js';
import { Container, ContentWithPaddingXl } from 'components/misc/Layouts';

export default () => {
	const dispatch = useDispatch();
	const [activeModule, setActiveModule] = useState('Dashboard');
	const modules = [
		{ title: 'Dashboard', component: <Dashboard /> },
		{ title: 'Gestión de Categorías', component: <CategoryManagement /> },
		{ title: 'Gestión de Productos', component: <ProductManagement /> },
		{ title: 'Gestión de Descuentos', component: <DiscountManagement /> },
		{ title: 'Gestión de Usuarios', component: <UserManagement /> },
		{ title: 'Gestión de Permisos', component: <PermissionsManagement /> },
	];

	return (
		<>
			<Header />
			<Container>
				<Typography
					variant="h4"
					gutterBottom
					sx={{
						textAlign: 'center',
						color: '#333',
						fontWeight: 'bold',
						marginBottom: 4,
					}}
				>
					Panel de Administrador
				</Typography>

				<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
					{/* Barra lateral fija */}
					<Drawer
						variant="permanent"
						sx={{
							width: 240,
							flexShrink: 0,
							'& .MuiDrawer-paper': {
								width: 240,
								boxSizing: 'border-box',
								position: 'fixed', // Fijo a la pantalla
								top: 230, // Ajusta la posición debajo del encabezado
								overflow: 'auto', // Habilita scroll interno en el Drawer si es necesario
								backgroundColor: 'transparent', // Fondo transparente
								border: 'none', // Sin bordes
								zIndex: 1200, // Asegura que el Drawer esté sobre otros elementos
							},
						}}
					>
						<List>
							{modules.map((module, index) => (
								<ListItem
									button
									key={index}
									selected={activeModule === module.title}
									onClick={() => setActiveModule(module.title)}
									sx={{
										'&.Mui-selected': {
											backgroundColor: 'rgba(0, 0, 0, 0.1)', // Color de selección
											borderRadius: 2,
										},
										'&:hover': {
											backgroundColor: 'rgba(0, 0, 0, 0.05)', // Color de hover
											borderRadius: 2,
										},
									}}
								>
									<ListItemText
										primary={module.title}
										sx={{ textAlign: 'center', color: '#333', fontWeight: 'bold' }}
									/>
								</ListItem>
							))}
						</List>
					</Drawer>

					{/* Contenido principal */}
					<Box
						component="main"
						sx={{
							flexGrow: 1,
							padding: 3,
							marginLeft: '240px', // Ajusta el espacio para la barra lateral
							marginTop: '64px', // Ajusta el espacio para el encabezado
							height: 'calc(100vh - 64px)', // Asegura que el contenido se ajuste al espacio restante
						}}
					>
						{/* Renderizar el módulo activo */}
						<Grid container spacing={4}>
							<Grid item xs={12}>
								<Paper
									sx={{
										padding: 3,
										boxShadow: 3,
										borderRadius: 2,
										backgroundColor: '#fff',
										height: '100%',
									}}
								>
									<Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: '600' }}>
										{activeModule}
									</Typography>
									{modules.find((module) => module.title === activeModule)?.component}
								</Paper>
							</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
};
