import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { decrementarCantidad, quitarItem, setComisionMP, setCostoEnvio, setDireccion } from 'store/carritoSlice';
import { calcularPrecioConDescuento } from 'utils/descuentoUtils';
import { handleAddToCart, handleQuitarDeCarrito } from 'utils/carritoUtils';
import CheckoutProButton from './CheckoutProMP';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useSearchParams } from 'react-router-dom';
import CheckoutStatusModal from './StatusScreenModal';
import TransferenciaModal from './TransferenciaModal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DireccionesModal from './DireccionesModal';
import { crearDireccion } from 'scripts/crearDireccion';
import Spinner from 'components/Spinner';
import { format } from 'date-fns';

const Container = tw.div`p-6 bg-white rounded-lg w-full mx-auto mt-8`;
const Content = tw.div`flex flex-col w-full`;
const ContentSection = tw.div`flex flex-col w-full items-center`;
const AddressSection = tw.div`mt-6 w-full bg-gray-100 p-4 rounded-lg shadow-md`;
const AddressItem = tw.div`flex justify-between items-center border-b pb-2 mb-2`;
const Image = tw.img`w-16 h-16 rounded mr-4`;
const Name = tw.h4`text-lg font-bold`;
const Price = tw.p`text-gray-600`;
const OriginalPrice = styled.p`
	${tw`line-through text-red-500`}
`;
const DiscountInfo = tw.p`text-sm text-green-600`;
const CartItem = tw.div`flex flex-col sm:flex-row items-center bg-white w-full rounded-lg p-4 shadow mb-4`;
const Info = tw.div`flex-1`;
const Actions = tw.div`flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0`;
const Quantity = tw.div`flex items-center space-x-2`;
const Button = tw.button`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300`;
const PaymentSection = tw.div`mb-4 p-6 bg-gray-100 rounded-lg shadow-md`;
const PaymentOption = tw.div`flex items-center mb-4`;
const Label = tw.label`ml-2 text-gray-700`;
const FinalizarCompraButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800`;

const CartPage = () => {
	const dispatch = useDispatch();
	const token = sessionStorage.getItem('token'); // Asegúrate de que el token esté en el store
	const user = useSelector((state) => state.usuario); // ID del cliente desde el store
	const [isLoading, setIsLoading] = useState(true); // Estado para el loader
	const [preferenceId, setPreferenceId] = useState(null);

	let userId = null;
	if (user.isLoggedIn) {
		userId = user.userInfo.id;
	}
	const [isModalOpen, setIsModalOpen] = useState(false);
	useEffect(() => {
		initMercadoPago('APP_USR-28f591e9-5e20-4be6-b155-a96076aaf777', { locale: 'es-UY' });
	}, []);
	const [paymentId, setPaymentId] = useState(null);
	const [searchParams] = useSearchParams();

	useEffect(() => {
		const payment = searchParams.get('payment_id'); // Captura el parámetro "status" de la URL
		if (payment && payment !== 'null') {
			setPaymentId(payment);
			setIsModalOpen(true);
		}
		// Limpiar los parámetros de la URL
		const newUrl = window.location.origin + window.location.pathname; // Construye la nueva URL sin parámetros
		window.history.replaceState({}, document.title, newUrl); // Reemplaza la URL actual
	}, [searchParams]);

	// Get cart items
	const cartItems = useSelector((state) => state.carrito.items);

	// Get cart items
	const pedidoId = useSelector((state) => state.carrito.pedidoId);

	// Get products and packs from their respective slices
	const productosRedux = useSelector((state) => state.productos);
	const packsRedux = useSelector((state) => state.packs);

	const SectionTitle = tw.h3`text-lg font-bold cursor-pointer flex justify-between items-center`;
	const CollapsibleContent = styled.div`
		${({ isOpen }) => (isOpen ? tw`block` : tw`hidden`)}
		${tw`mt-4`}
	`;

	// Function to get discounts based on item type
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

	const costoEnvio = useSelector((state) => state.carrito.costoEnvio);
	const comisionMP = useSelector((state) => state.carrito.comisionMP);
	const direccionId = useSelector((state) => state.carrito.direccionId);
	const subtotal = cartItems.reduce(
		(acc, item) => acc + calcularPrecioConDescuento(item.precioTotal, obtenerDescuentos(item)),
		0,
	);
	const total = (subtotal + (costoEnvio > 0 ? costoEnvio : 0)) * (1 + (comisionMP > 0 ? comisionMP / 100 : 0));
	
	const handleIncrement = (item) => {
		handleAddToCart(item, 1, token, userId, item.tipo, dispatch);
	};

	const handleDecrement = (item) => {
		handleQuitarDeCarrito(userId, item.id, 1, item.tipo, token);
		dispatch(decrementarCantidad(item));
	};

	const handleQuitarCarrito = (item) => {
		handleQuitarDeCarrito(userId, item.id, item.cantidad, item.tipo, token);
		dispatch(quitarItem(item));
	};

	const [direcciones, setDirecciones] = useState([]);
	const [mostrarModalDirecciones, setMostrarModalDirecciones] = useState(false);
	const [isLoadingDirecciones, setIsLoadingDirecciones] = useState(true);
	const [isOpenDirecciones, setIsOpenDirecciones] = useState(false);

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

	useEffect(() => {
		if (userId && pedidoId) {
			fetchDirecciones();
		}
	}, []);

	const [isOpenAgendar, setIsOpenAgendar] = useState(false);
	const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
	const [fechasOcupadas, setFechasOcupadas] = useState([]);
	const [fechaFormateada, setFechaFormateada] = useState(null);

	useEffect(() => {
		setFechaFormateada(format(fechaSeleccionada, 'yyyy-MM-dd'));
	}, [fechaSeleccionada]);

	useEffect(() => {
		const fetchFechasOcupadas = async () => {
			try {
				const response = await fetch('/api/fechas-ocupadas', {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				});
				const data = await response.json();
				setFechasOcupadas(data.fechas);
			} catch (error) {
				console.error('Error al obtener fechas ocupadas:', error);
			}
		};
		fetchFechasOcupadas();
	}, [token]);

	const isDateDisabled = (date) => {
		const formattedDate = date.toISOString().split('T')[0];
		return fechasOcupadas.includes(formattedDate);
	};

	const handleMercadoPago = async () => {
		setIsLoading(true); // Mostrar loader mientras se genera la preferencia
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
			setIsLoading(false); // Ocultar loader una vez que se complete la solicitud
		}
	};

	const [metodoPago, setMetodoPago] = useState('');
	const [mostrarModalTransferencia, setMostrarModalTransferencia] = useState(false); // Estado para mostrar el modal
	
	useEffect(() => {
		if (metodoPago === 'mercado-pago') {
			dispatch(setComisionMP(5.99));
		} else {
			dispatch(setComisionMP(0));
		}
	}, [metodoPago]);

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
		<Container>
			<Content>
				{cartItems.length > 0 ? (
					cartItems.map((item) => {
						const descuentos = obtenerDescuentos(item);
						const precioConDescuento = calcularPrecioConDescuento(item.precio, descuentos);
						const descuentoAplicado = item.precio - precioConDescuento;

						return (
							<CartItem key={`${item.id}-${item.tipo}`}>
								<Image
									src={item.imageSrc || 'https://via.placeholder.com/150'}
									alt={item.descripcion}
								/>
								<Info>
									<Name>{item.descripcion}</Name>
									{descuentoAplicado > 0 && <OriginalPrice>${item.precio.toFixed(2)}</OriginalPrice>}
									<Price>${precioConDescuento.toFixed(2)}</Price>
									{descuentoAplicado > 0 && (
										<DiscountInfo>
											Ahorras ${descuentoAplicado.toFixed(2)} gracias a descuentos aplicados.
										</DiscountInfo>
									)}
									<Price>Total: ${(precioConDescuento * item.cantidad).toFixed(2)}</Price>
								</Info>
								<Actions>
									<Quantity>
										<Button onClick={() => handleDecrement(item)}>-</Button>
										<span>{item.cantidad}</span>
										<Button onClick={() => handleIncrement(item)}>+</Button>
									</Quantity>
									<Button
										onClick={() => handleQuitarCarrito(item)}
										tw="bg-red-500 text-white hover:bg-red-700"
									>
										Quitar
									</Button>
								</Actions>
							</CartItem>
						);
					})
				) : (
					<p tw="text-gray-600">Tu carrito está vacío</p>
				)}
			</Content>
			{cartItems.length > 0 && (
				<>
					<Content>
						<SectionTitle onClick={() => setIsOpenAgendar(!isOpenAgendar)}>
							Agendar Envío
							<span>{isOpenAgendar ? '▲' : '▼'}</span>
						</SectionTitle>
						<ContentSection>
							<CollapsibleContent isOpen={isOpenAgendar}>
								<DatePicker
									selected={fechaSeleccionada}
									onChange={(date) => setFechaSeleccionada(date)}
									minDate={new Date().setDate(new Date().getDate())}
									filterDate={(date) => !isDateDisabled(date)}
									inline
								/>
								{fechaSeleccionada && (
									<p tw="text-sm text-green-600">
										Fecha seleccionada: {fechaSeleccionada.toLocaleDateString()}
									</p>
								)}
							</CollapsibleContent>
						</ContentSection>
					</Content>
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
					<br />
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
									handleMercadoPago();}}
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
				</>
			)}
			<CheckoutStatusModal
				payment={paymentId}
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				token={token}
				pedidoId={pedidoId}
				direccionId={direccionId}
				fechaEnvio={fechaFormateada}
				dispatch={dispatch}
			/>
		</Container>
	);
};

export default CartPage;
