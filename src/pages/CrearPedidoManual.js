import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from 'components/headers/light.js';
import { crearDireccion } from 'scripts/crearDireccion';
import { setCostoEnvio, setDireccion } from 'store/carritoSlice';
import tw from 'twin.macro';
import styled from 'styled-components';
import {
	TextField,
	Box,
} from '@mui/material';
import DireccionesModal from '../components/Cart/DireccionesModal';
import TransferenciaModal from '../components/Cart/TransferenciaModal';
import { calcularPrecioConDescuento } from '../utils/descuentoUtils';
import CheckoutProButton from '../components/Cart/CheckoutProMP';
import Spinner from '../components/Spinner';

export default () => {
	const PaymentSection = tw.div`mb-4 p-6 bg-gray-100 rounded-lg shadow-md`;
	const PaymentOption = tw.div`flex items-center mb-4`;
	const Label = tw.label`ml-2 text-gray-700`;
	const FinalizarCompraButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800`;
	const SectionTitle = tw.h3`text-lg font-bold cursor-pointer flex justify-between items-center`;
	const CollapsibleContent = styled.div`
		${({ isOpen }) => (isOpen ? tw`block` : tw`hidden`)}
		${tw`mt-4`}
	`;
	const Content = tw.div`flex flex-col w-full`;
	const AddressSection = tw.div`mt-6 w-full bg-gray-100 p-4 rounded-lg shadow-md`;
	const AddressItem = tw.div`flex justify-between items-center border-b pb-2 mb-2`;
	const StyledDiv = tw.div`font-display min-h-screen text-secondary-500 p-8 mt-32`;
	const dispatch = useDispatch();
	const token = sessionStorage.getItem('token');
	const user = useSelector((state) => state.usuario);
	const [direcciones, setDirecciones] = useState([]);
	const [mostrarModalDirecciones, setMostrarModalDirecciones] = useState(false);
	const [isLoadingDirecciones, setIsLoadingDirecciones] = useState(true);
	const [isOpenDirecciones, setIsOpenDirecciones] = useState(false);
	const [currentOrder, setCurrentOrder] = useState({
		estado: '',
		total: 0,
		fechaCreacion: '',
		id: '',
		cliente_id: '',
	});
	const cartItems = useSelector((state) => state.carrito.items);
	const costoEnvio = useSelector((state) => state.carrito.costoEnvio);
	const comisionMP = useSelector((state) => state.carrito.comisionMP);
	const direccionId = useSelector((state) => state.carrito.direccionId);
	const pedidoId = useSelector((state) => state.carrito.pedidoId);
	const [isLoading, setIsLoading] = useState(true); // Estado para el loader
	const [preferenceId, setPreferenceId] = useState(null);
	let userId = user?.userInfo?.id || null;
	if (user.isLoggedIn) {
		userId = user.userInfo.id;
	}
	const subtotal = cartItems.reduce((acc, item) => acc + calcularSubtotalItem(item), 0);
	const [fechaSeleccionada ] = useState(new Date());
	const [fechaFormateada ] = useState(null);
	const productosRedux = useSelector((state) => state.productos);
		const packsRedux = useSelector((state) => state.packs);
 
		const obtenerDescuentos = (item) => {
			if (item.tipo === 'producto') {
				const producto = productosRedux.find((prod) => prod.id === item.id);
				return producto ? producto.descuentos || [] : [];
			} else if (item.tipo === 'pack') {
				const pack = packsRedux.find((pck) => pck.id === item.id);
				return pack ? pack.descuentos || [] : [];
			}
			return [];
		};
	// Calcular el subtotal de cada ítem, sumando el costo del adicional si existe
		const calcularSubtotalItem = (item) => {
			const precioConDescuento = calcularPrecioConDescuento(item.precio, obtenerDescuentos(item));
			const adicionalCosto = item.adicional?.costoAdicional || 0;
			return (precioConDescuento + adicionalCosto) * item.cantidad;
		};

	
		const total = (subtotal + (costoEnvio > 0 ? costoEnvio : 0)) * (1 + (comisionMP > 0 ? comisionMP / 100 : 0));
	const fetchDirecciones = async () => {
		try {
			const response = await fetch(`/direcciones?cliente_id=${userId}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setDirecciones(data);

				const direccionDefault = data.find((direccion) => direccion.predeterminado);
				console.log(direccionId);
				if (direccionDefault && direccionId === '') {
					seleccionarDireccion(direccionDefault.id);
				}
			} else {
				console.error('Error al obtener las direcciones:', response.statusText);
			}
		} catch (error) {
			console.error('Error al obtener las direcciones:', error);
		} finally {
			setIsLoadingDirecciones(false);
		}
	};

	const guardarDireccion = (direccion) => {
		// Aquí envías la dirección al backend
		const fetchCrearPedido = async () => {
			await crearDireccion(direccion, token)
				.then((data) => {
					fetchDirecciones().then(() => {
						seleccionarDireccion(data.id);
					});
				})
				.catch((e) => {
					console.log('Error creando la direccion:' + e);
				}); // Llama al script para cargar las categorías en Redux
		};
		fetchCrearPedido();
	};

	const seleccionarDireccion = async (id) => {
		dispatch(setDireccion(id));
		try {
			const response = await fetch(
				'/direcciones/calcularCostoEnvio?direccion_id=' + id + '&pedido_id=' + pedidoId,
				{
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				},
			);

			const data = await response.json();
			if (data && data.costoEnvio) {
				dispatch(setCostoEnvio(data.costoEnvio));
			} else {
				alert('Error al obtener el costo de envio.');
				console.log(data);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Ocurrió un error al obtener el costo de envio.');
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCurrentOrder({ ...currentOrder, [name]: value });
	};
	
	const handleMercadoPago = async () => {
		setIsLoading(true); 
		const BASE_URL = process.env.REACT_APP_URL || 'http://localhost:3000';
		const backUrls = {
			success: `${BASE_URL}/carrito`,
			pending: `${BASE_URL}/carrito`,
			failure: `${BASE_URL}/carrito`,
		};
		try {
			const response = await fetch('/pagos/crearPreferencia', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					pedido_id: pedidoId,
					direccion_id: direccionId,
					fecha_envio: fechaFormateada,
					backUrls: backUrls,
				}),
			});

			const data = await response.json();
			if (data && data.preference_id) {
				setPreferenceId(data.preference_id);
			} else {
				alert('Error al generar la preferencia de pago.');
			}
		} catch (error) {
			console.error('Error:', error);
			alert('Ocurrió un error al procesar el pago.');
		} finally {
			setIsLoading(false); 
		}
	};

	const [metodoPago, setMetodoPago] = useState('');
	const [mostrarModalTransferencia, setMostrarModalTransferencia] = useState(false); 

	const handleSeleccionMetodoPago = (metodo) => {
		if (direccionId && fechaSeleccionada) {
			setMetodoPago(metodo);
			setPreferenceId('');
		}
	};

	const handleFinalizarCompraTransferencia = () => {
		setMostrarModalTransferencia(true);
	};

	return (
		<>
			<Header />
			<StyledDiv>
				<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
					Productos:
					<TextField
						name="Productos"
						value={currentOrder.fechaCreacion}
						onChange={handleInputChange}
						fullWidth
						sx={{ marginBottom: 2 }}
					/>
					<Content>
						<SectionTitle onClick={() => setIsOpenDirecciones(!isOpenDirecciones)}>
							Direcciones
							<span>{isOpenDirecciones ? '▲' : '▼'}</span>
						</SectionTitle>
						<CollapsibleContent isOpen={isOpenDirecciones}>
							<AddressSection>
								{isLoadingDirecciones ? (
									<p>Cargando direcciones...</p>
								) : direcciones.length > 0 ? (
									direcciones.map((direccion) => (
										<AddressItem
											key={direccion.id}
											onClick={() => seleccionarDireccion(direccion.id)}
											style={{
												backgroundColor: direccionId === direccion.id ? '#99cdb6' : '#f7f7f7',
												cursor: 'pointer',
												padding: '10px',
												borderRadius: '8px',
											}}
										>
											<div>
												<p tw="text-sm font-semibold">{direccion.titulo}</p>
												<p>{direccion.barrio}</p>
												<p>{direccion.direccion}</p>
											</div>
											{direccion.predeterminado && <p tw="text-green-500">Predeterminada</p>}
										</AddressItem>
									))
								) : (
									<p>No tienes direcciones registradas.</p>
								)}
								{/* Botón para abrir el modal */}
								<div tw="mt-4">
									<button
										onClick={() => setMostrarModalDirecciones(true)}
										tw="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
									>
										+ Agregar Dirección
									</button>
								</div>

								{/* Modal para agregar direcciones */}
								<DireccionesModal
									userId={userId}
									mostrarModalDirecciones={mostrarModalDirecciones}
									setMostrarModalDirecciones={setMostrarModalDirecciones}
									onGuardarDireccion={guardarDireccion}
								/>
							</AddressSection>
						</CollapsibleContent>
					</Content>
					<PaymentSection>
						<SectionTitle>Métodos de Pago</SectionTitle>
						<PaymentOption>
							<input
								type="radio"
								id="mercado-pago"
								name="metodo-pago"
								value="mercado-pago"
								onChange={() => {
									handleSeleccionMetodoPago('mercado-pago');
									handleMercadoPago();
								}}
								disabled={!direccionId || !fechaSeleccionada}
							/>
							<Label htmlFor="mercado-pago">
								Pagar con Mercado Pago (+ comisión de 5,99% a cargo del cliente)
							</Label>
						</PaymentOption>
						<PaymentOption>
							<input
								type="radio"
								id="transferencia"
								name="metodo-pago"
								value="transferencia"
								onChange={() => handleSeleccionMetodoPago('transferencia')}
								disabled={!direccionId || !fechaSeleccionada}
							/>
							<Label htmlFor="transferencia">Pagar por Transferencia</Label>
						</PaymentOption>
					</PaymentSection>
					<TransferenciaModal
						mostrarModalTransferencia={mostrarModalTransferencia}
						setMostrarModalTransferencia={setMostrarModalTransferencia}
						pedidoId={pedidoId}
						direccionId={direccionId}
						fechaEnvio={fechaFormateada}
						token={token}
						dispatch={dispatch}
					/>
					<div tw="mt-8">
						<h3 tw="text-lg font-semibold">Resumen Total</h3>
						<p>Subtotal: ${subtotal.toFixed(2)}</p>
						{costoEnvio === -1 ? (
							<p tw="text-sm text-red-600">Envío: Coordina el costo de envío por WhatsApp.</p>
						) : (
							<p>Envío: ${Math.round(costoEnvio)}</p>
						)}
						<p>Total: ${total.toFixed(2)}</p>
					</div>
					{metodoPago === 'mercado-pago' &&
						(isLoading || !preferenceId ? (
							<Spinner text="Creando link de pago..." />
						) : (
							<CheckoutProButton preferenceId={preferenceId} />
						))}

					{metodoPago === 'transferencia' && (
						<FinalizarCompraButton onClick={handleFinalizarCompraTransferencia}>
							Finalizar Compra
						</FinalizarCompraButton>
					)}
				</Box>
			</StyledDiv>
		</>
	);
};
