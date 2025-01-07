import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { Box, Grid, Paper, Typography } from '@mui/material';
import Dashboard from 'components/AdminPanel/Dashboard';
import ProductManagement from 'components/AdminPanel/ProductManagement';
import UserManagement from 'components/AdminPanel/UserManagement';
import CategoryManagement from 'components/AdminPanel/CategoryManagement';
import OrderManagement from 'components/AdminPanel/OrderManagement';
import DiscountManagement from 'components/AdminPanel/DiscountManagement';
import PermissionsManagement from 'components/AdminPanel/PermissionsManagement';
import AdditionalManagement from 'components/AdminPanel/AdditionalManagement';
import Header from 'components/headers/light.js';

export default () => {
	const dispatch = useDispatch();
	const [categories, setCategories] = useState([]);
	const categoriasRedux = useSelector((state) => state.categorias);

	const descargarPDF = async () => {
		try {
			const response = await fetch('/reporte/generarReportePedidos', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (!response.ok) {
				throw new Error('Error al generar el reporte');
			}

			const data = await response.json();
			const base64Data = data.file;

			const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
			const blob = new Blob([binaryData], { type: 'application/pdf' });

			const fileName = 'reporte.pdf';
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
		} catch (error) {
			console.error('Error al descargar el PDF:', error);
			alert('No se pudo descargar el reporte');
		}
	};

	const descargarReporteUsuarios = async () => {
		try {
			const response = await fetch('/reporte/generarReporteUsuarios', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
			});
	
			if (!response.ok) {
				throw new Error('Error al generar el reporte de usuarios');
			}
	
			const data = await response.json();
			const base64Data = data.file;
	
			const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
			const blob = new Blob([binaryData], { type: 'application/pdf' });
	
			const fileName = 'reporte_usuarios.pdf';
			const link = document.createElement('a');
			link.href = URL.createObjectURL(blob);
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(link.href);
		} catch (error) {
			console.error('Error al descargar el PDF:', error);
			alert('No se pudo descargar el reporte de usuarios');
		}
	};

  const modules = [
    //{ title: "Dashboard", component: <Dashboard /> },
    { title: "Gestión de Pedidos", component: <OrderManagement /> },
    { title: "Gestión de Categorías", component: <CategoryManagement /> },
    { title: "Gestión de Productos", component: <ProductManagement /> },
    //{ title: "Gestión de Adicionales de Productos", component: <AdditionalManagement /> },
    { title: "Gestión de Descuentos", component: <DiscountManagement /> },
    { title: "Gestión de Usuarios", component: <UserManagement /> },
    { title: "Gestión de Permisos", component: <PermissionsManagement /> },
	{
		title: 'Reporte de pedidos',
		component: (
			<button
				onClick={descargarPDF}
				style={{
					backgroundColor: '#99cdb6',
					color: 'white',
					padding: '10px 20px',
					borderRadius: '5px',
					border: 'none',
					cursor: 'pointer',
				}}
			>
				Descargar Reporte
			</button>
		),
	},
	{
		title: 'Reporte de usuarios',
		component: (
			<button
				onClick={descargarReporteUsuarios}
				style={{
					backgroundColor: '#99cdb6',
					color: 'white',
					padding: '10px 20px',
					borderRadius: '5px',
					border: 'none',
					cursor: 'pointer',
				}}
			>
				Descargar Reporte de Usuarios
			</button>
		),
	}
  ];

  return (
    <AnimationRevealPage>
      <Header />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
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
									backgroundColor: '#fff',
									height: '100%',
								}}
							>
								<Typography variant="h6" gutterBottom sx={{ color: '#333', fontWeight: '600' }}>
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
