// components/cart/PaymentSelector.js
import React, { useEffect } from 'react';
import tw from 'twin.macro';
import { useDispatch } from 'react-redux';
import { setComisionMP } from 'store/carritoSlice';

const Container = tw.div`flex flex-col w-full`;
const Title = tw.h2`text-2xl font-bold mb-4`;
const PaymentOption = tw.div`flex items-center mb-4 cursor-pointer p-3 rounded-lg border border-gray-300 hover:bg-gray-100`;
const Label = tw.label`ml-2 text-gray-700`;
const SelectButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 self-start`;

const PaymentSelector = ({
	setStep,
	metodoPago,
	setMetodoPago,
	handleMercadoPago,
	setPreferenceId,
	deliveryMethod,
}) => {
	const dispatch = useDispatch();

	useEffect(() => {
		if (metodoPago === 'mercado-pago') {
			dispatch(setComisionMP(5.99));
			handleMercadoPago();
		} else {
			dispatch(setComisionMP(0));
			setPreferenceId(null);
		}
	}, [metodoPago, dispatch]);

	return (
		<Container>
			<Title>Selecciona un método de pago</Title>
			<PaymentOption onClick={() => setMetodoPago('mercado-pago')}>
				<input type="radio" name="metodo-pago" checked={metodoPago === 'mercado-pago'} readOnly />
				<Label>Pagar con Mercado Pago (+5,99% de comisión)</Label>
			</PaymentOption>
			<PaymentOption onClick={() => setMetodoPago('transferencia')}>
				<input type="radio" name="metodo-pago" checked={metodoPago === 'transferencia'} readOnly />
				<Label>Pagar por Transferencia</Label>
			</PaymentOption>
			{deliveryMethod === 'pickup' && (
				<PaymentOption onClick={() => setMetodoPago('efectivo')}>
					<input type="radio" name="metodo-pago" checked={metodoPago === 'efectivo'} readOnly />
					<Label>Pagar con Efectivo al retirar</Label>
				</PaymentOption>
			)}
			<SelectButton onClick={() => setStep(2)}>Volver</SelectButton>
		</Container>
	);
};

export default PaymentSelector;
