// pages/CartPage.js
import React, { useEffect, useState } from 'react';
import CartSteps from './CartSteps';
import OrderSummary from './OrderSummary';
import CheckoutButtons from './CheckoutButtons';
import tw from 'twin.macro';
import { useSelector, useDispatch } from 'react-redux';
import { handleAddToCart, handleQuitarDeCarrito } from 'utils/carritoUtils';
import { calcularPrecioConDescuento } from 'utils/descuentoUtils';
import { decrementarCantidad, limpiarCarrito, quitarItem, setNotas } from 'store/carritoSlice';
import { toast } from 'react-toastify';
import { initMercadoPago } from '@mercadopago/sdk-react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { crearPreferencia } from 'scripts/crearPreferenciaPagoMP';
import CheckoutStatusModal from '../StatusScreenModal';
import TransferenciaModal from '../TransferenciaModal';
import { finalizarPedido } from 'scripts/finalizarPedido';

const PageContainer = tw.div`flex flex-col min-h-128`;
const ContentContainer = tw.div`flex flex-col lg:flex-row flex-grow w-full p-6`;
const LeftColumn = tw.div`w-full lg:w-2/3 pr-6`;
const RightColumn = tw.div`w-full lg:w-1/3 p-6 lg:sticky lg:top-0 self-start mt-6 lg:mt-0`;
const NotasTextField = tw.textarea`w-full p-2 border rounded-lg mt-4`;

const CartPage = () => {
	const dispatch = useDispatch();
	const [step, setStep] = useState(1);
	const token = sessionStorage.getItem('token'); // Asegúrate de que el token esté en el store
	const user = useSelector((state) => state.usuario); // ID del cliente desde el store
	const [isLoading, setIsLoading] = useState(false); // Estado para el loader
	const [preferenceId, setPreferenceId] = useState(null);
	const notas = useSelector((state) => state.carrito.notas);

	const deliveryMethod = useSelector((state) => state.carrito.deliveryMethod);

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
	// Calcular el subtotal de cada ítem, sumando el costo del adicional si existe
	const calcularSubtotalItem = (item) => {
		const precioConDescuento = calcularPrecioConDescuento(item.precio, obtenerDescuentos(item));
		const adicionalCosto = item.adicional?.costoAdicional || 0;
		return (precioConDescuento + adicionalCosto) * item.cantidad;
	};
	const subtotal = cartItems.reduce((acc, item) => acc + calcularSubtotalItem(item), 0);

	const handleIncrement = (item) => {
		handleAddToCart(item, 1, item.adicional?.id, token, userId, item.tipo, dispatch);
	};

	const handleDecrement = (item) => {
		handleQuitarDeCarrito(userId, item.id, 1, item.tipo, item.adicional?.id, token);
		dispatch(decrementarCantidad(item));
	};

	const handleQuitarCarrito = (item) => {
		handleQuitarDeCarrito(userId, item.id, item.cantidad, item.tipo, item.adicional?.id, token);
		dispatch(quitarItem(item));
	};

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
		try {
			crearPreferencia(pedidoId, direccionId, fechaFormateada, deliveryMethod, token).then((data) => {
				if (data && data.preference_id) {
					setPreferenceId(data.preference_id);
				} else {
					toast.error('Error al generar la preferencia de pago.');
				}
			});
		} catch (error) {
			console.error('Error:', error);
			toast.error('Ocurrió un error al procesar el pago.');
		} finally {
			setIsLoading(false); // Ocultar loader una vez que se complete la solicitud
		}
	};
	const [metodoPago, setMetodoPago] = useState('');
	const [mostrarModalTransferencia, setMostrarModalTransferencia] = useState(false); // Estado para mostrar el modal

	const handleFinalizarCompraTransferencia = () => {
		setMostrarModalTransferencia(true);
	};

	const handleFinalizarCompraEfectivo = () => {
		const fetchFinalizarCompraEfectivo = async () => {
			await finalizarPedido(pedidoId, 3, '', direccionId, fechaFormateada, deliveryMethod, notas, token)
				.then(() => {
					toast.success('¡Gracias por tu compra!');
					dispatch(limpiarCarrito());
				})
				.catch((e) => {
					console.error('Error al finalizar la compra:', e);
					toast.error('Ocurrió un error al finalizar la compra.');
				});
		};
		fetchFinalizarCompraEfectivo();
	};

	const handleNotasChange = (event) => {
		dispatch(setNotas(event.target.value));
	};

	return (
		<PageContainer>
			<ContentContainer>
				{cartItems.length > 0 ? (
					<>
						<LeftColumn>
							<CartSteps
								cartItems={cartItems}
								costoEnvio={costoEnvio}
								comisionMP={comisionMP}
								step={step}
								setStep={setStep}
								metodoPago={metodoPago}
								direccionId={direccionId}
								setMetodoPago={setMetodoPago}
								handleMercadoPago={handleMercadoPago}
								handleIncrement={handleIncrement}
								handleDecrement={handleDecrement}
								handleQuitarCarrito={handleQuitarCarrito}
								setIsLoading={setIsLoading}
								preferenceId={preferenceId}
								setPreferenceId={setPreferenceId}
								obtenerDescuentos={obtenerDescuentos}
								calcularSubtotalItem={calcularSubtotalItem}
								calcularPrecioConDescuento={calcularPrecioConDescuento}
								setFechaSeleccionada={setFechaSeleccionada}
								deliveryMethod={deliveryMethod}
							/>
						</LeftColumn>
						<RightColumn>
							<OrderSummary subtotal={subtotal} costoEnvio={costoEnvio} comisionMP={comisionMP} />
							<NotasTextField
								placeholder="Notas del Pedido: ej (no funciona el timbre)"
								rows={4}
								value={notas}
								onChange={handleNotasChange}
							/>
							<CheckoutButtons
								isLoading={isLoading}
								metodoPago={metodoPago}
								preferenceId={preferenceId}
								setIsLoading={setIsLoading}
								setPreferenceId={setPreferenceId}
								handleFinalizarCompraTransferencia={handleFinalizarCompraTransferencia}
								handleFinalizarCompraEfectivo={handleFinalizarCompraEfectivo}
							/>
						</RightColumn>
						<TransferenciaModal
							mostrarModalTransferencia={mostrarModalTransferencia}
							setMostrarModalTransferencia={setMostrarModalTransferencia}
							pedidoId={pedidoId}
							direccionId={direccionId}
							fechaEnvio={fechaFormateada}
							deliveryMethod={deliveryMethod}
							notas={notas}
							token={token}
							dispatch={dispatch}
						/>
						<CheckoutStatusModal
							payment={paymentId}
							isModalOpen={isModalOpen}
							setIsModalOpen={setIsModalOpen}
							token={token}
							pedidoId={pedidoId}
							direccionId={direccionId}
							fechaEnvio={fechaFormateada}
							deliveryMethod={deliveryMethod}
							notas={notas}
							dispatch={dispatch}
						/>
					</>
				) : (
					<p>Tu carrito está vacío</p>
				)}
			</ContentContainer>
		</PageContainer>
	);
};

export default CartPage;
