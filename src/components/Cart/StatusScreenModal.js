import React, { useEffect, useState } from 'react';
import { StatusScreen } from '@mercadopago/sdk-react';
import Modal from 'react-modal'; // Usar react-modal (o personalizar si no quieres usar dependencias)
import { finalizarPedido } from 'scripts/finalizarPedido';
import { limpiarCarrito } from 'store/carritoSlice';

const CheckoutStatusModal = ({
	payment,
	isModalOpen,
	setIsModalOpen,
	token,
	pedidoId,
	direccionId,
	fechaEnvio,
	dispatch,
}) => {
	const [pagoVerificado, setPagoVerificado] = useState(false);

	useEffect(() => {
		try {
			if (payment != null) {
				finalizarPedido(pedidoId, 2, payment, direccionId, fechaEnvio, token)
					.then((data) => {
						setPagoVerificado(true);
					})
					.catch((e) => {
						setPagoVerificado(true);
						console.log('No hay pedidos EN_PROGRESO');
					});
			}
		} catch (error) {
			console.error('Error al procesar el pedido:', error);
		}
	}, [payment, pedidoId, token]);

	const handleCloseModal = () => {
		setIsModalOpen(false);
		pagoVerificado && dispatch(limpiarCarrito());
	};

	return (
		<div>
			{/* Modal */}
			<Modal
				isOpen={isModalOpen}
				onRequestClose={() => setIsModalOpen(false)}
				contentLabel="Estado del Pago"
				style={{
					content: {
						position: 'fixed',
						top: '50%',
						left: '50%',
						right: 'auto',
						bottom: 'auto',
						marginRight: '-50%',
						transform: 'translate(-50%, -50%)',
						width: '90%',
						maxWidth: '500px',
						maxHeight: '500px',
						padding: '20px',
						borderRadius: '10px',
						backgroundColor: '#fff', // Asegúrate de que el fondo sea opaco
						zIndex: 1002, // Prioridad sobre otros elementos
					},
					overlay: { position: 'fixed', backgroundColor: 'rgba(0, 0, 0, 0.75)', zIndex: 1001 },
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
					{/* StatusScreen de Mercado Pago */}
					{pagoVerificado ? (
						<StatusScreen initialization={{ paymentId: payment }} />
					) : (
						<p>Cargando estado del pago...</p>
					)}

					{/* Botón de Cerrar */}
					<button
						onClick={() => handleCloseModal()}
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

export default CheckoutStatusModal;
