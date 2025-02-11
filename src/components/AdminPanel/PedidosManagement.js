import React, { useEffect } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button as MuiButton,
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { obtenerPedidos } from 'scripts/obtenerPedidos';
import { metodosPago, pedidoEstados } from 'utils/enums';
import { toast } from 'react-toastify';

const PedidosManagement = () => {
	const dispatch = useDispatch();

	// Fetch de datos (pedidos)
	const fetchPedidos = async () => {
		obtenerPedidos(dispatch, sessionStorage.getItem('token')).catch((e) => {
			toast.error(e.message);
		});
	};

	useEffect(() => {
		try {
			fetchPedidos();
		} catch (e) {
			console.error(e);
		}
	}, [dispatch]);

	const getEstado = (order) => {
		if (order.estado === 3 && order.retiro_local) {
			return 'LISTO_PARA_RETIRAR';
		} else {
			return pedidoEstados[order.estado];
		}
	};

	const orders = useSelector((state) => state.pedidos.pedidos || []);

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
							<TableCell>Notas del Cadete</TableCell>
							<TableCell>Fecha de creacion</TableCell>
							<TableCell>Cliente</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{orders.length > 0 ? (
							orders.map((order) => (
								<TableRow key={order.id}>
									<TableCell>{order.id}</TableCell>
									<TableCell>{getEstado(order)}</TableCell>
									<TableCell>
										{metodosPago[order.metodo_pago - 1].nombre + '\n' + order.estado_pago}
									</TableCell>
									<TableCell>${order.total?.toFixed(2) || '0.00'}</TableCell>
									<TableCell>{order.notas_cadete}</TableCell>
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
		</div>
	);
};

export default PedidosManagement;
