import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { useSelector } from 'react-redux';
import { format, parse } from 'date-fns';
import { obtenerPedidosParaCadete } from 'scripts/obtenerPedidosParaCadete';
import { marcarPedidoComoEntregado } from 'scripts/marcarPedidoComoEntregado';
import { reasignarPedidoCadete } from 'scripts/reasignarPedidoCadete';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField } from '@mui/material';
import { crearNotaCadete } from 'scripts/crearNotaCadete';
import { toast } from 'react-toastify';
const Container = tw.div`p-6 bg-white rounded-lg w-full mx-auto mt-8`;
const PedidoItem = tw.div`flex justify-between items-center border-b pb-2 mb-2 p-4 rounded-lg shadow-md bg-gray-100`;
const ButtonContainer = tw.div`flex items-center justify-start`;
const ButtonPanel = tw.button`px-4 py-2 mr-2 bg-green-500 text-white rounded hover:bg-green-700`;
const AssignedPedidoItem = tw(PedidoItem)`bg-[#99cdb6]`;
const PedidoAtrasado = tw(PedidoItem)`bg-[#ffc4c4]`;
const BluePedidoItem = tw(PedidoItem)`bg-blue-100`;
const SectionTitle = tw.h3`text-lg font-bold cursor-pointer flex justify-between items-center`;
const Divider = tw.hr`my-2 border-t border-gray-300`;

const PanelCadetes = () => {
	const [pedidosHoy, setPedidosHoy] = useState([]);
	const [pedidosPosteriores, setPedidosPosteriores] = useState([]);
	const [pedidosAtrasados, setPedidosAtrasados] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [open, setOpen] = useState(false);
	const [notas, setNotas] = useState('');
	const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
	const token = sessionStorage.getItem('token');
	const userId = useSelector((state) => state.usuario.userInfo.id);

	const fetchPedidos = async () => {
		try {
			const data = await obtenerPedidosParaCadete(userId, token);
			setPedidosHoy(data.pedidosHoy);
			setPedidosPosteriores(data.pedidosPosteriores);
			setPedidosAtrasados(data.pedidosAtrasados);
		} catch (error) {
			alert(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleMarcarComoEntregado = async (pedidoId) => {
		try {
			await marcarPedidoComoEntregado(pedidoId, token);
			fetchPedidos();
		} catch (error) {
			alert(error.message);
		}
	};

	const handleReasignarPedido = async (pedidoId) => {
		try {
			await reasignarPedidoCadete(pedidoId, userId, token);
			fetchPedidos();
		} catch (error) {
			alert(error.message);
		}
	};

	const handleOpen = (pedido) => {
		setPedidoSeleccionado(pedido);
		setNotas(pedido.notas_cadete);
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		setNotas(e.target.value);
	};

	const handleSaveNotas = () => {
		crearNotaCadete(notas, pedidoSeleccionado.id, sessionStorage.getItem('token'))
			.then((data) => {
				toast.success(data.message);
			})
			.catch((e) => {
				toast.error(e.error);
			});
		handleClose();
		fetchPedidos();
	};

	useEffect(() => {
		fetchPedidos();
	}, []);

	return (
		<AnimationRevealPage>
			<Container>
				{isLoading ? (
					<p>Cargando pedidos...</p>
				) : (
					<>
						{pedidosAtrasados.length > 0 && (
							<>
								<SectionTitle>Pedidos atrasados</SectionTitle>
								{pedidosAtrasados.map((pedido) => {
									if (pedido.cadete_asignado === userId) {
										return (
											<AssignedPedidoItem key={pedido.id}>
												<div>
													<p>Pedido #{pedido.id}</p>
													<Divider />
													<div>
														{pedido.direccion && (
															<div>
																<p>Direccion: {pedido.direccion}</p>
																<Divider />
															</div>
														)}
													</div>
													<Divider />
													<div>
														{pedido.cliente_telefono && (
															<div>
																<p>Telefono del Cliente: {pedido.cliente_telefono}</p>
																<Divider />
															</div>
														)}
													</div>
													<p>
														Fecha de entrega:{' '}
														{pedido.fecha_entrega
															? format(
																	parse(
																		pedido.fecha_entrega,
																		'yyyy-MM-dd',
																		new Date(),
																	),
																	'dd/MM/yyyy',
															  )
															: 'Sin fecha definida'}
													</p>
												</div>
												<ButtonContainer>
													<ButtonPanel onClick={() => handleMarcarComoEntregado(pedido.id)}>
														Marcar como Entregado
													</ButtonPanel>
													<ButtonPanel onClick={() => handleOpen(pedido)}>Notas</ButtonPanel>
												</ButtonContainer>
											</AssignedPedidoItem>
										);
									} else if (pedido.cadete_asignado === null) {
										return (
											<PedidoAtrasado key={pedido.id}>
												<div>
													<p>Pedido #{pedido.id}</p>
													<Divider />
													<div>
														{pedido.direccion && (
															<div>
																<p>Direccion: {pedido.direccion}</p>
																<Divider />
															</div>
														)}
													</div>
													<p>No tiene cadete asignado</p>
													<Divider />
													<div>
														{pedido.cliente_telefono && (
															<div>
																<p>Telefono del Cliente: {pedido.cliente_telefono}</p>
																<Divider />
															</div>
														)}
													</div>
													<p>
														Fecha de entrega:{' '}
														{pedido.fecha_entrega
															? format(
																	parse(
																		pedido.fecha_entrega,
																		'yyyy-MM-dd',
																		new Date(),
																	),
																	'dd/MM/yyyy',
															  )
															: 'Sin fecha definida'}
													</p>
												</div>
												<ButtonPanel onClick={() => handleReasignarPedido(pedido.id)}>
													Asignar
												</ButtonPanel>
											</PedidoAtrasado>
										);
									} else {
										return (
											<BluePedidoItem key={pedido.id}>
												<div>
													<p>Pedido #{pedido.id}</p>
													<Divider />
													<div>
														{pedido.direccion && (
															<div>
																<p>Direccion: {pedido.direccion}</p>
																<Divider />
															</div>
														)}
													</div>
													<p>Cadete Asignado: {pedido.cadete_asignado}</p>
													<Divider />
													<p>
														Fecha de entrega:{' '}
														{pedido.fecha_entrega
															? format(
																	parse(
																		pedido.fecha_entrega,
																		'yyyy-MM-dd',
																		new Date(),
																	),
																	'dd/MM/yyyy',
															  )
															: 'Sin fecha definida'}
													</p>
												</div>
												<ButtonPanel onClick={() => handleReasignarPedido(pedido.id)}>
													Reasignar
												</ButtonPanel>
											</BluePedidoItem>
										);
									}
								})}
								<Divider />
							</>
						)}

						<SectionTitle>Pedidos para entregar hoy</SectionTitle>
						{pedidosHoy.length > 0 ? (
							pedidosHoy.map((pedido) => {
								if (pedido.cadete_asignado === userId) {
									return (
										<AssignedPedidoItem key={pedido.id}>
											<div>
												<p>Pedido #{pedido.id}</p>
												<Divider />
												<div>
													{pedido.direccion && (
														<div>
															<p>Direccion: {pedido.direccion}</p>
															<Divider />
														</div>
													)}
												</div>
												<div>
													{pedido.cliente_telefono && (
														<div>
															<p>Telefono del Cliente: {pedido.cliente_telefono}</p>
															<Divider />
														</div>
													)}
												</div>
											</div>
											<ButtonContainer>
												<ButtonPanel onClick={() => handleMarcarComoEntregado(pedido.id)}>
													Marcar como Entregado
												</ButtonPanel>
												<ButtonPanel onClick={() => handleOpen(pedido)}>Notas</ButtonPanel>
											</ButtonContainer>
										</AssignedPedidoItem>
									);
								} else if (pedido.cadete_asignado === null) {
									return (
										<PedidoItem key={pedido.id} style={{ backgroundColor: '#f0f0f0' }}>
											<div>
												<p>Pedido #{pedido.id}</p>
												<Divider />
												<div>
													{pedido.direccion && (
														<div>
															<p>Direccion: {pedido.direccion}</p>
															<Divider />
														</div>
													)}
												</div>
												<p>No tiene cadete asignado</p>
												<Divider />
												<div>
													{pedido.cliente_telefono && (
														<div>
															<p>Telefono del Cliente: {pedido.cliente_telefono}</p>
															<Divider />
														</div>
													)}
												</div>
											</div>
											<ButtonPanel onClick={() => handleReasignarPedido(pedido.id)}>
												Asignar
											</ButtonPanel>
										</PedidoItem>
									);
								} else {
									return (
										<BluePedidoItem key={pedido.id}>
											<div>
												<p>Pedido #{pedido.id}</p>
												<Divider />
												<div>
													{pedido.direccion && (
														<div>
															<p>Direccion: {pedido.direccion}</p>
															<Divider />
														</div>
													)}
												</div>
												<p>Cadete Asignado: {pedido.cadete_asignado}</p>
											</div>
											<ButtonPanel onClick={() => handleReasignarPedido(pedido.id)}>
												Reasignar
											</ButtonPanel>
										</BluePedidoItem>
									);
								}
							})
						) : (
							<p>No hay pedidos para entregar hoy.</p>
						)}

						<SectionTitle>Pedidos posteriores</SectionTitle>
						{pedidosPosteriores.length > 0 ? (
							pedidosPosteriores.map((pedido) => (
								<PedidoItem key={pedido.id}>
									<div>
										<p>Pedido #{pedido.id}</p>
										<Divider />
										<div>
											{pedido.detalles
												?.filter((detalle) => detalle.descripcion !== 'Envío')
												.map((detalle, index) => (
													<div key={index}>
														<p>Producto: {detalle.descripcion}</p>
														<p>Cantidad: {detalle.cantidad}</p>
														<Divider />
													</div>
												))}
										</div>
										<div>
											{pedido.direccion && (
												<div>
													<p>Direccion: {pedido.direccion}</p>
													<Divider />
												</div>
											)}
										</div>
										<div>
											{pedido.cliente_telefono && (
												<div>
													<p>Telefono del Cliente: {pedido.cliente_telefono}</p>
													<Divider />
												</div>
											)}
										</div>
										<p>
											Fecha de entrega:{' '}
											{pedido.fecha_entrega
												? format(
														parse(pedido.fecha_entrega, 'yyyy-MM-dd', new Date()),
														'dd/MM/yyyy',
												  )
												: 'Sin fecha definida'}
										</p>
									</div>
								</PedidoItem>
							))
						) : (
							<p>No hay pedidos posteriores a hoy.</p>
						)}
					</>
				)}
				{/* Formulario para agregar o editar adicional */}
				<Dialog open={open} onClose={handleClose}>
					<DialogTitle>Notas</DialogTitle>
					<DialogContent>
						<TextField
							name="notas"
							variant="outlined"
							value={notas}
							multiline
							rows={2}
							onChange={handleInputChange}
							fullWidth
							sx={{ width: 250, marginBottom: 2 }}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="secondary">
							Cancelar
						</Button>
						<Button onClick={handleSaveNotas} color="primary">
							Guardar Notas
						</Button>
					</DialogActions>
				</Dialog>
			</Container>
		</AnimationRevealPage>
	);
};

export default PanelCadetes;
