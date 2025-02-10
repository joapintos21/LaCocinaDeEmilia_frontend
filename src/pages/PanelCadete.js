import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { useSelector } from 'react-redux';
import { format, parse } from 'date-fns';
import { obtenerPedidosParaCadete } from 'scripts/obtenerPedidosParaCadete';
import { marcarPedidoComoEntregado } from 'scripts/marcarPedidoComoEntregado';
import { reasignarPedidoCadete } from 'scripts/reasignarPedidoCadete';
const Container = tw.div`p-6 bg-white rounded-lg w-full mx-auto mt-8`;
const PedidoItem = tw.div`flex justify-between items-center border-b pb-2 mb-2 p-4 rounded-lg shadow-md bg-gray-100`;
const Button = tw.button`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700`;
const AssignedPedidoItem = tw(PedidoItem)`bg-[#99cdb6]`;
const BluePedidoItem = tw(PedidoItem)`bg-blue-100`;
const SectionTitle = tw.h3`text-lg font-bold cursor-pointer flex justify-between items-center`;
const Divider = tw.hr`my-2 border-t border-gray-300`;

const PanelCadetes = () => {
	const [pedidosHoy, setPedidosHoy] = useState([]);
	const [pedidosPosteriores, setPedidosPosteriores] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const token = sessionStorage.getItem('token');
	const userId = useSelector((state) => state.usuario.userInfo.id);

	const fetchPedidos = async () => {
		try {
			const data = await obtenerPedidosParaCadete(userId, token);
			setPedidosHoy(data.pedidosHoy);
			setPedidosPosteriores(data.pedidosPosteriores);
		} catch (error) {
			alert(error.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleMarcarComoEntregado = async (pedidoId) => {
		try {
			await marcarPedidoComoEntregado(pedidoId, token);
			setPedidosHoy((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== pedidoId));
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
											</div>
											<Button onClick={() => handleMarcarComoEntregado(pedido.id)}>
												Marcar como Entregado
											</Button>
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
											</div>
											<Button onClick={() => handleReasignarPedido(pedido.id)}>Asignar</Button>
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
											<Button onClick={() => handleReasignarPedido(pedido.id)}>Reasignar</Button>
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
			</Container>
		</AnimationRevealPage>
	);
};

export default PanelCadetes;
