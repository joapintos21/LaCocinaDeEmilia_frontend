import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, Drawer, List, ListItem, ListItemText } from '@mui/material';
import Dashboard from 'components/AdminPanel/Dashboard';
import ProductManagement from 'components/AdminPanel/ProductManagement';
import UserManagement from 'components/AdminPanel/UserManagement';
import CategoryManagement from 'components/AdminPanel/CategoryManagement';
import OrderManagement from 'components/AdminPanel/OrderManagement';
import DiscountManagement from 'components/AdminPanel/DiscountManagement';
import PermissionsManagement from 'components/AdminPanel/PermissionsManagement';
import AdditionalManagement from 'components/AdminPanel/AdditionalManagement';
import GastosManagement from 'components/AdminPanel/GastosManagement';
import ReportManagement from 'components/AdminPanel/ReportManagement';
import EmpresaManagement from 'components/AdminPanel/EmpresaManagement';
import Header from 'components/headers/light.js';
import tw from 'twin.macro';
import CuponesManagement from 'components/AdminPanel/CuponesManagement';
const StyledDiv = tw.div`font-display min-h-screen text-secondary-500 p-8 overflow-hidden mt-32`;

export default () => {
	const [activeModule, setActiveModule] = useState('Dashboard');

	const modules = [
		{ title: 'Dashboard', component: <Dashboard /> },
		{ title: 'Pedidos', component: <OrderManagement /> },
		{ title: 'Categorías', component: <CategoryManagement /> },
		{ title: 'Productos', component: <ProductManagement /> },
		{ title: 'Adicionales', component: <AdditionalManagement /> },
		{ title: 'Descuentos', component: <DiscountManagement /> },
		{ title: 'Cupones', component: <CuponesManagement /> },
		{ title: 'Usuarios', component: <UserManagement /> },
		{ title: 'Permisos', component: <PermissionsManagement /> },
		{ title: 'Gastos', component: <GastosManagement /> },
		{ title: 'Reportes', component: <ReportManagement /> },
		{ title: 'Empresa', component: <EmpresaManagement /> },
	];

	return (
		<>
			<Header />
			<StyledDiv>
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
								position: 'fixed',
								top: 180,
								overflowY: 'auto',
								height: 'calc(100vh - 200px)',
								backgroundColor: 'transparent',
								border: 'none',
								zIndex: 1200,
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
							marginLeft: '240px',
							marginTop: '64px',
							height: 'calc(100vh - 64px)',
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
			</StyledDiv>
		</>
	);
};
