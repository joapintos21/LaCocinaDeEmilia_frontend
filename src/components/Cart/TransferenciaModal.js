import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { finalizarPedido } from 'scripts/finalizarPedido';
import { limpiarCarrito } from 'store/carritoSlice';
import { obtenerEmpresa } from '../../scripts/obtenerEmpresa';
import { useDispatch, useSelector } from 'react-redux';

const TransferenciaModal = ({
	mostrarModalTransferencia,
	setMostrarModalTransferencia,
	pedidoId,
	direccionId,
	fechaEnvio,
	deliveryMethod = 'delivery',
	notas,
	token,
	dispatch,
}) => {
	const [mostrarEstadoModal, setMostrarEstadoModal] = useState(false); // Control del modal de estado
	const [estadoMensaje, setEstadoMensaje] = useState(''); // Mensaje del estado del pedido

	const handleTransferencia = async () => {
		try {
			finalizarPedido(pedidoId, 1, '', direccionId, fechaEnvio, deliveryMethod, notas, token).then((data) => {
				setEstadoMensaje(
					'Pedido ingresado correctamente! Se encuentra pendiente de confirmación de pago. Por favor envíe el comprobante por WhatsApp al número +598 91123456.',
				);
			});
		} catch (error) {
			console.error('Error al procesar el pedido:', error);
			setEstadoMensaje(`Error: ${error.message}`);
		} finally {
			setMostrarModalTransferencia(false); // Cierra el modal de transferencia
			setMostrarEstadoModal(true); // Abre el modal de estado
		}
	};

	const handleEstadoModal = () => {
		dispatch(limpiarCarrito());
		setMostrarEstadoModal(false);
	};

	const fetchEmpresa = async () => {
		try {
			await obtenerEmpresa(dispatch, sessionStorage.getItem('token'));
		} catch (e) {
			console.log(e);
		}
	};
	useEffect(() => {
		fetchEmpresa();
	}, []);

	const empresa = useSelector((state) => state.empresa || {});

	return (
		<div style={{ zIndex: '1000' }}>
			{/* Modal de Transferencia */}
			<Modal
				isOpen={mostrarModalTransferencia}
				onRequestClose={() => setMostrarModalTransferencia(false)}
				contentLabel="Datos para Transferencia"
				style={{
					content: {
						top: '50%',
						left: '50%',
						right: 'auto',
						bottom: 'auto',
						marginRight: '-50%',
						transform: 'translate(-50%, -50%)',
						width: '90%',
						maxWidth: '500px',
						padding: '20px',
						borderRadius: '10px',
					},
					overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1001 },
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<h3>Datos para la Transferencia</h3>
					<p>{empresa.descripcion_transferencia}</p>
					<button
						onClick={handleTransferencia}
						style={{
							marginTop: '20px',
							padding: '10px 20px',
							fontSize: '14px',
							backgroundColor: '#99cdb6',
							color: '#fff',
							border: 'none',
							borderRadius: '5px',
							cursor: 'pointer',
						}}
					>
						Enviar
					</button>
				</div>
			</Modal>

			{/* Modal de Estado del Pago */}
			<Modal
				isOpen={mostrarEstadoModal}
				onRequestClose={() => setMostrarEstadoModal(false)}
				contentLabel="Estado del Pago"
				style={{
					content: {
						top: '50%',
						left: '50%',
						right: 'auto',
						bottom: 'auto',
						marginRight: '-50%',
						transform: 'translate(-50%, -50%)',
						width: '90%',
						maxWidth: '500px',
						padding: '20px',
						borderRadius: '10px',
					},
					overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1001 },
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					<h3>Estado del Pedido</h3>
					<p>{estadoMensaje}</p>
					<button
						onClick={() => handleEstadoModal()}
						style={{
							marginTop: '20px',
							padding: '10px 20px',
							fontSize: '14px',
							backgroundColor: '#99cdb6',
							color: '#fff',
							border: 'none',
							borderRadius: '5px',
							cursor: 'pointer',
						}}
					>
						Cerrar
					</button>
				</div>
			</Modal>
		</div>
	);
};

export default TransferenciaModal;
