import React, { useState, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Grid,
	Button as MuiButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import tw from 'twin.macro';
import { obtenerPedidos } from 'scripts/obtenerPedidos';

const OrderManagement = () => {
	const Container = tw.div`p-6 bg-white rounded-lg w-full mx-auto mt-8`;
	const [searchTerm, setSearchTerm] = useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate(); // Crear una instancia de navigate

	// Fetch de datos (pedidos)
	const fetchPedidos = async () => {
		await obtenerPedidos(dispatch, sessionStorage.getItem('token'));
	};

	useEffect(() => {
		try {
			fetchPedidos();
		} catch (e) {
			console.error(e);
		}
	}, [dispatch]);

	const orders = useSelector((state) => state.pedidos || []);

	const filteredOrders = orders.filter((order) =>
		(order.customerName ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
	);

	// Función para redirigir al usuario
	const handleAddClick = () => {
		navigate('/crear-pedido-manual'); // Ruta a la que deseas redirigir
	};

	return (
		<div style={{ marginTop: '20px' }}>
			{/* Botón de agregar */}
			<Box sx={{ marginBottom: 2, paddingBottom: 2, borderBottom: '2px solid #ccc' }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={2} md={1}>
						<MuiButton variant="contained" color="success" onClick={handleAddClick}>
							<AddIcon />
						</MuiButton>
					</Grid>
				</Grid>
			</Box>

			{/* Tabla de pedidos */}
			<TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF' }}>
						<TableRow>
							<TableCell>Estado</TableCell>
							<TableCell>Total</TableCell>
							<TableCell>Fecha de creacion</TableCell>
							<TableCell>Id</TableCell>
							<TableCell>Id cliente</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredOrders.length > 0 ? (
							filteredOrders.map((order) => (
								<TableRow key={order.id}>
									<TableCell>{order.estado}</TableCell>
									<TableCell>${order.total?.toFixed(2) || '0.00'}</TableCell>
									<TableCell>{order.fechaCreacion}</TableCell>
									<TableCell>{order.id}</TableCell>
									<TableCell>{order.cliente_id}</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} style={{ textAlign: 'center' }}>
									No hay pedidos disponibles.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default OrderManagement;
