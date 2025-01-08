import React, { useState, useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Paper,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Box,
	Grid,
	InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { obtenerPedidos } from 'scripts/obtenerPedidos';
import { useDispatch, useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';

const OrderManagement = () => {
	const [error, setError] = useState('');
	const dispatch = useDispatch();
	const fetchPedidos = async () => {
		await obtenerPedidos(dispatch, sessionStorage.getItem('token'));
	};

	const [open, setOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [currentOrder, setCurrentOrder] = useState({
		estado: '',
		total: 0,
		fechaCreacion: '',
		id: '',
		cliente_id: '',
	});
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		try {
			fetchPedidos();
		} catch (e) {
			console.log(e);
		}
		setError('');
	}, [dispatch]);

	const orders = useSelector((state) => state.pedidos || []);

	const handleOpen = (order = null) => {
		if (order) {
			setCurrentOrder({
				estado: '',
				total: 0,
				fechaCreacion: '',
				id: 0,
				cliente_id: 0,
			});
		} else {
			setCurrentOrder({
				estado: '',
				total: 0,
				fechaCreacion: '',
				id: 0,
				cliente_id: 0,
			});
		}
		setOpen(true);
	};

	const handleClose = () => setOpen(false);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCurrentOrder({ ...currentOrder, [name]: value });
	};

	const handleSaveOrder = () => {
		if (
			currentOrder.estado &&
			currentOrder.total &&
			currentOrder.fechaCreacion &&
			currentOrder.id &&
			currentOrder.cliente_id
		) {
			/*if (currentOrder.id === null) {
				const pedidoToAdd = { ...currentOrder };

				crearPedido(, sessionStorage.getItem('token'))
					.then((data) => {
						console.log('Pedido agregado:', data);
						fetchPedidos();
					})
					.catch((error) => {
						console.error('Error al crear el pedido:', error.message);
						setError(error.message);
					});
			} else {
				crearPedido(
					,
					sessionStorage.getItem('token'),
				)
					.then((data) => {
						console.log('Pedido actualizado:', data);
						fetchPedidos();
					})
					.catch((error) => {
						console.error('Error al actualizar el pedido:', error.message);
						setError(error.message);
					});
			}
      setCurrentOrder({ endpoint: '', tipo: '', rol_id: '' });
      */

			fetchPedidos();
			handleClose();
		} else {
			alert('Por favor, complete todos los campos.');
		}
	};

	const handleDelete = (id) => {
		/*borrarPedido(id, sessionStorage.getItem('token'))
          .then((data) => {
            console.log('Pedido eliminado:', data);
            fetchPedidos();
          })
          .catch((error) => {
            console.error('Error al eliminar el pedido:', error.message);
            setError(error.message);
          });
        dispatch(deletePedido(id));
    */
		fetchPedidos();
	};

	const filteredOrders = orders.filter((order) =>
		(order.customerName ?? '').toLowerCase().includes(searchTerm.toLowerCase()),
	);

	return (
		<div style={{ marginTop: '20px' }}>
			{/* Botón de agregar */}
			<Box sx={{ marginBottom: 2, paddingBottom: 2, borderBottom: '2px solid #ccc' }}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} sm={2} md={1}>
						<Button variant="contained" color="success" onClick={() => handleOpen()}>
							<AddIcon />
						</Button>
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
									<TableCell>
										${typeof order.total === 'number' ? order.total.toFixed(2) : '0.00'}
									</TableCell>
									<TableCell>{order.fechaCreacion}</TableCell>
									<TableCell>{order.id}</TableCell>
									<TableCell>{order.id_cliente}</TableCell>
									<TableCell>
										<Button
											variant="outlined"
											color="primary"
											onClick={() => handleOpen(order)}
											sx={{ marginRight: 2 }}
										>
											Editar
										</Button>
										<Button
											variant="outlined"
											color="secondary"
											onClick={() => handleDelete(order.id)}
										>
											Eliminar
										</Button>
									</TableCell>
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

			{/* Formulario */}
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>{isEditing ? 'Editar Pedido' : 'Agregar Pedido'}</DialogTitle>
				<DialogContent>
					Estado
					<FormControl fullWidth sx={{ marginBottom: 2 }}>
						<Select name="estado" value={currentOrder.estado} onChange={handleInputChange}>
							<MenuItem value="1">Inicial</MenuItem>
						</Select>
					</FormControl>
					Total
					<TextField
						name="total"
						type="number"
						value={currentOrder.total}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Fecha de creacion
					<TextField
						name="fechaCreacion"
						type="date"
						value={currentOrder.fechaCreacion}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					Identificador de Cliente
					<TextField
						name="id_cliente"
						value={currentOrder.fechaCreacion}
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
						{isEditing ? 'Guardar Cambios' : 'Agregar'}
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default OrderManagement;
