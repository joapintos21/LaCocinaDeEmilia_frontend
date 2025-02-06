// components/cart/CheckoutButtons.js
import React from 'react';
import tw from 'twin.macro';
import CheckoutProButton from '../CheckoutProMP';
import Spinner from 'components/Spinner';

const Container = tw.div`flex flex-col w-full`;
const FinalizarCompraButton = tw.button`px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 mt-2`;

const CheckoutButtons = ({
	metodoPago,
	isLoading,
	preferenceId,
	handleFinalizarCompraTransferencia,
	handleFinalizarCompraEfectivo,
}) => {
	return (
		<Container>
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
			{metodoPago === 'efectivo' && (
				<FinalizarCompraButton onClick={handleFinalizarCompraEfectivo}>Finalizar Compra</FinalizarCompraButton>
			)}
		</Container>
	);
};

export default CheckoutButtons;
