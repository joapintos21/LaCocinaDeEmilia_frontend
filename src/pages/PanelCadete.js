import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { useSelector } from 'react-redux';
import { format, parse } from 'date-fns';
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
			const response = await fetch(`/pedidos/obtenerPedidosParaCadete?usuario_id=${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			if (response.ok) {
				const data = await response.json();
				setPedidosHoy(data.pedidosHoy);
				setPedidosPosteriores(data.pedidosPosteriores);
			} else {
				console.error('Error al obtener pedidos:', response.statusText);
				alert('Hubo un problema al obtener los pedidos.');
			}
		} catch (error) {
			console.error('Error al obtener pedidos:', error);
			alert('No se pudo conectar al servidor.');
		} finally {
			setIsLoading(false);
		}
	};

	const marcarComoEntregado = async (pedidoId) => {
		try {
			const response = await fetch('/pedidos/marcarComoEntregado', {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ pedido_id: pedidoId }),
			});
			if (response.ok) {
				setPedidosHoy((prevPedidos) => prevPedidos.filter((pedido) => pedido.id !== pedidoId));
			} else {
				console.error('Error al marcar pedido como entregado:', response.statusText);
				alert('No se pudo marcar el pedido como entregado.');
			}
		} catch (error) {
			console.error('Error al marcar pedido como entregado:', error);
			alert('Error al conectar con el servidor.');
		}
	};

	const reasignarPedido = async (pedidoId) => {
		try {
			const response = await fetch('/pedidos/reasignarCadete', {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ pedido_id: pedidoId, userId: userId }),
			});
			if (response.ok) {
				fetchPedidos();
			} else {
				console.error('Error al reasignar pedido:', response.statusText);
				alert('No se pudo reasignar el pedido.');
			}
		} catch (error) {
			console.error('Error al reasignar pedido:', error);
			alert('Error al conectar con el servidor.');
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
											<Button onClick={() => marcarComoEntregado(pedido.id)}>
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
											<Button onClick={() => reasignarPedido(pedido.id)}>Asignar</Button>
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
											<Button onClick={() => reasignarPedido(pedido.id)}>Reasignar</Button>
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
