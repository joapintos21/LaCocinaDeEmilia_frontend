import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import { useSelector } from 'react-redux';
import { format, parse } from 'date-fns';
import { obtenerPedidosParaCocinera } from 'scripts/obtenerPedidosParaCocinera';
import { marcarPedidoComoTerminado } from 'scripts/marcarPedidoComoTerminado';
import { reasignarPedido } from 'scripts/reasignarPedido';
import { toast } from 'react-toastify';
import { actualizarPedidoCocinera } from 'scripts/actualizarPedidoCocinera';

const Container = tw.div`p-6 bg-white rounded-lg w-full mx-auto mt-8`;
const PedidoItem = tw.div`flex justify-between items-center border-b pb-2 mb-2 p-4 rounded-lg shadow-md bg-gray-100`;
const Button = tw.button`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700`;
const SectionTitle = tw.h3`text-lg font-bold cursor-pointer flex justify-between items-center`;
const Divider = tw.hr`my-2 border-t border-gray-300`;

const PanelCocineras = () => {
	const [pedidosHoy, setPedidosHoy] = useState([]);
	const [pedidosPosteriores, setPedidosPosteriores] = useState([]);
	const [pedidosRealizados, setPedidosRealizados] = useState([]);
	const [pedidosAtrasados, setPedidosAtrasados] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const token = sessionStorage.getItem('token');
	const userId = useSelector((state) => state.usuario.userInfo.id);

	const fetchPedidos = async () => {
		setIsLoading(true);
		try {
			const data = await obtenerPedidosParaCocinera(userId, token);
			setPedidosHoy(data.pedidosHoy);
			setPedidosPosteriores(data.pedidosPosteriores);
			setPedidosRealizados(data.pedidosRealizados);
			setPedidosAtrasados(data.pedidosAtrasados);
		} catch (error) {
			alert('Hubo un problema al obtener los pedidos.');
		} finally {
			setIsLoading(false);
		}
	};

	const handleMarcarTerminado = async (pedidoId) => {
		try {
			await marcarPedidoComoTerminado(pedidoId, token);
			fetchPedidos();
		} catch (error) {
			alert('No se pudo marcar el pedido como terminado.');
		}
	};

	const handleReasignarPedido = async (pedidoId) => {
		try {
			await reasignarPedido(pedidoId, userId, token);
			fetchPedidos();
		} catch (error) {
			alert('No se pudo reasignar el pedido.');
		}
	};

	const handleVolverATrabajar = (pedido) => {
		actualizarPedidoCocinera(pedido, sessionStorage.getItem('token'))
			.then((data) => {
				toast.success(data.message);
				fetchPedidos();
			})
			.catch((e) => {
				toast.error(e.error);
			});
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
									return (
										<PedidoItem
											key={pedido.id}
											style={{
												backgroundColor: !pedido.cocinera_asignada
													? '#ffc4c4'
													: pedido.cocinera_asignada !== userId
													? '#add8e6'
													: '#99cdb6',
											}}
										>
											<div>
												<p>Pedido #{pedido.id}</p>
												<Divider />
												<div>
													{pedido.detalles
														?.filter(
															(detalle) =>
																!detalle.descripcion.includes('Envío') &&
																!detalle.descripcion.includes('Cupon'),
														)
														.map((detalle, index) => (
															<div key={index}>
																<p>Producto: {detalle.descripcion}</p>
																<p>Cantidad: {detalle.cantidad}</p>
																<Divider />
															</div>
														))}
												</div>
												<p>
													{pedido.cocinera_asignada
														? `Cocinera Asignada: ${pedido.cocinera_asignada}`
														: 'No tiene cocinera asignada'}
												</p>
											</div>
											{pedido.cocinera_asignada === userId ? (
												<Button onClick={() => handleMarcarTerminado(pedido.id)}>
													Marcar como Terminado
												</Button>
											) : (
												<Button onClick={() => handleReasignarPedido(pedido.id)}>
													{pedido.cocinera_asignada ? 'Reasignar' : 'Asignar'}
												</Button>
											)}
										</PedidoItem>
									);
								})}
								<Divider />
							</>
						)}

						<SectionTitle>Pedidos para entregar hoy</SectionTitle>
						{pedidosHoy.length > 0 ? (
							pedidosHoy.map((pedido) => {
								return (
									<PedidoItem
										key={pedido.id}
										style={{
											backgroundColor: !pedido.cocinera_asignada
												? '#f0f0f0'
												: pedido.cocinera_asignada !== userId
												? '#add8e6'
												: '#99cdb6',
										}}
									>
										<div>
											<p>Pedido #{pedido.id}</p>
											<Divider />
											<div>
												{pedido.detalles
													?.filter(
														(detalle) =>
															!detalle.descripcion.includes('Envío') &&
															!detalle.descripcion.includes('Cupon'),
													)
													.map((detalle, index) => (
														<div key={index}>
															<p>Producto: {detalle.descripcion}</p>
															<p>Cantidad: {detalle.cantidad}</p>
															<Divider />
														</div>
													))}
											</div>
											<p>
												{pedido.cocinera_asignada
													? `Cocinera Asignada: ${pedido.cocinera_asignada}`
													: 'No tiene cocinera asignada'}
											</p>
										</div>
										{pedido.cocinera_asignada === userId ? (
											<Button onClick={() => handleMarcarTerminado(pedido.id)}>
												Marcar como Terminado
											</Button>
										) : (
											<Button onClick={() => handleReasignarPedido(pedido.id)}>
												{pedido.cocinera_asignada ? 'Reasignar' : 'Asignar'}
											</Button>
										)}
									</PedidoItem>
								);
							})
						) : (
							<p>No hay pedidos para entregar hoy.</p>
						)}
						<Divider />
						<SectionTitle>Pedidos posteriores</SectionTitle>
						{pedidosPosteriores.length > 0 ? (
							pedidosPosteriores.map((pedido) => {
								return (
									<PedidoItem
										key={pedido.id}
										style={{
											backgroundColor: !pedido.cocinera_asignada
												? '#f0f0f0'
												: pedido.cocinera_asignada !== userId
												? '#add8e6'
												: '#99cdb6',
										}}
									>
										<div>
											<p>Pedido #{pedido.id}</p>
											<Divider />
											<div>
												{pedido.detalles
													?.filter(
														(detalle) =>
															!detalle.descripcion.includes('Envío') &&
															!detalle.descripcion.includes('Cupon'),
													)
													.map((detalle, index) => (
														<div key={index}>
															<p>Producto: {detalle.descripcion}</p>
															<p>Cantidad: {detalle.cantidad}</p>
															<Divider />
														</div>
													))}
											</div>
											<p>
												Cocinera Asignada:{' '}
												{pedido.cocinera_asignada
													? pedido.cocinera_asignada
													: 'No tiene cocinera asignada'}
											</p>
											<Divider />
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
										{pedido.cocinera_asignada === userId ? (
											<Button onClick={() => handleMarcarTerminado(pedido.id)}>
												Marcar como Terminado
											</Button>
										) : (
											<Button onClick={() => handleReasignarPedido(pedido.id)}>
												{pedido.cocinera_asignada ? 'Reasignar' : 'Asignar'}
											</Button>
										)}
									</PedidoItem>
								);
							})
						) : (
							<p>No hay pedidos posteriores a hoy.</p>
						)}
						<Divider />
						<SectionTitle>Pedidos realizados</SectionTitle>
						{pedidosRealizados.length > 0 ? (
							pedidosRealizados.map((pedido) => {
								return (
									<PedidoItem
										key={pedido.id}
										style={{
											backgroundColor: '#add8e6',
										}}
									>
										<div>
											<p>Pedido #{pedido.id}</p>
											<Divider />
											<div>
												{pedido.detalles
													?.filter(
														(detalle) =>
															!detalle.descripcion.includes('Envío') &&
															!detalle.descripcion.includes('Cupon'),
													)
													.map((detalle, index) => (
														<div key={index}>
															<p>Producto: {detalle.descripcion}</p>
															<p>Cantidad: {detalle.cantidad}</p>
															<Divider />
														</div>
													))}
											</div>
											<p>
												Cocinera Asignada:{' '}
												{pedido.cocinera_asignada
													? pedido.cocinera_asignada
													: 'No tiene cocinera asignada'}
											</p>
											<Divider />
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
										<Button onClick={() => handleVolverATrabajar(pedido.id)}>
											Volver a preparar
										</Button>
									</PedidoItem>
								);
							})
						) : (
							<p>No hay pedidos realizados.</p>
						)}
					</>
				)}
			</Container>
		</AnimationRevealPage>
	);
};

export default PanelCocineras;
