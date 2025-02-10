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
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	TextField,
	DialogActions,
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { obtenerPedidos } from 'scripts/obtenerPedidos';
import { metodosPago, pedidoEstados } from 'utils/enums';
import { toast } from 'react-toastify';
import { crearPago } from 'scripts/crearPago';

const PedidosManagement = () => {
	const dispatch = useDispatch();
	const [open, setOpen] = useState(false);
	const [pago, setPago] = useState({
		pedido_id: '',
		metodo_pago_id: '',
		referencia: '',
		monto: '',
		fecha_pago: '',
		observaciones: '',
	});

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

	const orders = useSelector((state) => state.pedidos.pedidos || []);

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setPago({ ...pago, [name]: value });
	};

	const handleSaveOrder = () => {
		crearPago(pago, sessionStorage.getItem('token'))
			.then((data) => {
				toast.success('Pago registrado exitosamente.');
			})
			.catch((e) => {
				toast.error('Error al registrar el pago: ' + e.message);
			});
		handleClose();
		fetchPedidos();
	};

	return (
		<div style={{ marginTop: '20px' }}>
			{/* Tabla de pedidos */}
			<TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
				<Table>
					<TableHead sx={{ position: 'sticky', top: 0, backgroundColor: '#FFFFFF' }}>
						<TableRow>
							<TableCell>Numero de pedido</TableCell>
							<TableCell>Estado</TableCell>
							<TableCell>Pago</TableCell>
							<TableCell>Total</TableCell>
							<TableCell>Cocinera asignada</TableCell>
							<TableCell>Fecha de creacion</TableCell>
							<TableCell>Cliente</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.length > 0 ? (
							orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell>{order.id}</TableCell>
									<TableCell>{pedidoEstados[order.estado]}</TableCell>
									<TableCell>
										{metodosPago[order.metodo_pago - 1].nombre + '\n' + order.estado_pago}
									</TableCell>
									<TableCell>${order.total?.toFixed(2) || '0.00'}</TableCell>
									<TableCell>{order.cocinera_nombre}</TableCell>
									<TableCell>{order.fechaCreacion}</TableCell>
									<TableCell>{order.cliente_nombre}</TableCell>
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
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Inresar Pago</DialogTitle>
				<DialogContent>
					Método de pago
					<TextField
						name="metodo_pago_id"
						variant="outlined"
						value={pago.metodo_pago_id}
						onChange={handleInputChange}
						fullWidth
						select
						SelectProps={{
							native: true,
						}}
						style={{ marginBottom: '10px' }}
					>
						<option value="">Seleccionar método de pago</option>
						{metodosPago.map((metodo) => (
							<option key={metodo.id} value={metodo.id}>
								{metodo.nombre}
							</option>
						))}
					</TextField>
					Monto
					<TextField
						name="monto"
						type="number"
						value={pago.monto}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Fecha del Pago
					<TextField
						name="fecha_pago"
						type="date"
						value={pago.fecha_pago}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Referencia
					<TextField
						name="referencia"
						value={pago.referencia}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Observaciones
					<TextField
						name="observaciones"
						value={pago.observaciones}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancelar
					</Button>
					<Button onClick={handleSaveOrder} color="primary">
						Crear Pago
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default PedidosManagement;
