// components/cart/PaymentSelector.js
import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import { useDispatch, useSelector } from 'react-redux';
import { setComisionMP, setCupon } from 'store/carritoSlice';
import { toast } from 'react-toastify';
import { validarCupon } from 'scripts/validarCupon';

const Container = tw.div`flex flex-col w-full`;
const Title = tw.h2`text-2xl font-bold mb-4`;
const PaymentOption = tw.div`flex items-center mb-4 cursor-pointer p-3 rounded-lg border border-gray-300 hover:bg-gray-100`;
const CuponContainer = tw.div`flex w-full items-center mb-4`;
const Cupon = tw.input`flex mb-4 cursor-pointer p-3 rounded-lg border border-gray-300 hover:bg-gray-100`;
const ValidateButton = tw.button`ml-2 mb-4 px-4 py-2 bg-[#99cdb6] text-white rounded hover:bg-primary-800`;
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
	const [codigo, setCodigo] = useState('');
	const user = useSelector((state) => state.usuario.userInfo);

	const handleCuponChange = (e) => {
		setCodigo(e.target.value.toUpperCase());
	};

	const handleValidateCupon = () => {
		validarCupon(codigo, sessionStorage.getItem('token'))
			.then((data) => {
				toast.success('Cupón validado: ' + data.codigo);
				dispatch(setCupon(data));
			})
			.catch((e) => {
				toast.error(e.message);
				dispatch(setCupon(''));
			});
	};

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
			{user.rol_id !== 1 && (
				<PaymentOption onClick={() => setMetodoPago('mercado-pago')}>
					<input type="radio" name="metodo-pago" checked={metodoPago === 'mercado-pago'} readOnly />
					<Label>Pagar con Mercado Pago (+5,99% de comisión)</Label>
				</PaymentOption>
			)}
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
			<Title>Cupón de descuento</Title>
			<CuponContainer>
				<Cupon onChange={(e) => handleCuponChange(e)} />
				<ValidateButton onClick={handleValidateCupon}>Validar</ValidateButton>
			</CuponContainer>
			<SelectButton onClick={() => setStep(3)}>Volver</SelectButton>
		</Container>
	);
};

export default PaymentSelector;
