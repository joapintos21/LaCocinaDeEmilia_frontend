import React, { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalStyles from 'styles/GlobalStyles';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RestaurantLandingPage from 'Main.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from 'pages/Login';
import SignUp from 'pages/Signup';
import VerificarCuenta from 'pages/VerificarCuenta';
import AboutUs from 'pages/AboutUs';
import ContactUs from 'pages/ContactUs';
import Pricing from 'pages/Pricing';
import BlogIndex from 'pages/BlogIndex';
import Productos from 'pages/Productos';
import PanelAdministrador from 'pages/PanelAdministrador';
import PaginaProducto from 'pages/PaginaProducto';
import Carrito from 'pages/Carrito';
import PaginaPack from 'pages/PaginaPack';
import { obtenerCategorias } from 'scripts/obtenerCategorias';
import { useDispatch, useSelector } from 'react-redux';
import { obtenerPacks } from 'scripts/obtenerPacks';
import { obtenerPedidoEnProgreso } from 'scripts/obtenerPedidoEnProgreso';
import ScrollToTop from 'helpers/ScrollToTop';
import { limpiarCarrito } from 'store/carritoSlice';
import PanelCocineras from 'pages/PanelCocineras';
import PaginaPedidos from 'pages/PaginaPedidos';
import PanelCadetes from 'pages/PanelCadete';
import RecuperarPassword from 'pages/RecuperarPassword';
import ResetearPassword from 'pages/ResetearPassword';
import CrearPedidoManual from 'pages/CrearPedidoManual';

const theme = createTheme({
	palette: {
		grey: {
			200: '#f5f5f5',
			500: '#9e9e9e',
			700: '#616161',
		},
	},
});

export default function App() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.usuario.userInfo);
	const token = sessionStorage.getItem('token');

	useEffect(() => {
		try {
			const fetchCategorias = async () => {
				await obtenerCategorias(dispatch).catch((e) => {
					toast.error('Error en el Obtener Categorias');
				});
			};
			fetchCategorias();

			const fetchPacks = async () => {
				await obtenerPacks(dispatch).catch((e) => {
					toast.error('Error en el Obtener Packs');
				});
			};
			fetchPacks();

			if (user && user.rol === 'Cliente' && token) {
				const fetchPedido = async () => {
					await obtenerPedidoEnProgreso(user.id, token, dispatch).catch((e) => {
						console.log('Error en el Obtener Pedido:' + e);
						dispatch(limpiarCarrito());
					});
				};
				fetchPedido();
			} else {
				dispatch(limpiarCarrito());
			}
		} catch (e) {
			console.log(e);
			toast.error('Error al cargar la página. Por favor, recargue la página.');
		}
	}, [dispatch, user, token]);

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light"
			/>
			<GlobalStyles />
			<ThemeProvider theme={theme}>
				<Router>
					<ScrollToTop />
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/forgot-password" element={<RecuperarPassword />} />
						<Route path="/reset-password" element={<ResetearPassword />} />
						<Route path="/signup" element={<SignUp />} />
						<Route path="/verificar" element={<VerificarCuenta />} />
						<Route path="/nosotros" element={<AboutUs />} />
						<Route path="/contacto" element={<ContactUs />} />
						<Route path="/pricing" element={<Pricing />} />
						<Route path="/blog" element={<BlogIndex />} />
						<Route path="/productos" element={<Productos />} />
						<Route path="/producto/:id" element={<PaginaProducto />} />
						<Route path="/pack/:id" element={<PaginaPack />} />
						<Route path="/carrito" element={<Carrito />} />
						<Route path="/paneladministrador" element={<PanelAdministrador />} />
						<Route path="/mis_pedidos" element={<PaginaPedidos />} />
						<Route path="/panelcocineras" element={<PanelCocineras />} />
						<Route path="/panelcadetes" element={<PanelCadetes />} />
						<Route path="/crear-pedido-manual" element={<CrearPedidoManual />} />
						<Route path="/" element={<RestaurantLandingPage />} />
					</Routes>
				</Router>
			</ThemeProvider>
		</>
	);
}
