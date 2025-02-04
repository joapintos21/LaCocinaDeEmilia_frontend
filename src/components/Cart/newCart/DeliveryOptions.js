// components/cart/DeliveryOptions.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCostoEnvio, setDeliveryMethod, setDireccion } from 'store/carritoSlice';
import tw from 'twin.macro';

const Container = tw.div`flex flex-col w-full`;
const Title = tw.h2`text-2xl font-bold mb-4`;
const Option = tw.button`px-6 py-3 bg-gray-200 rounded hover:bg-gray-300 mt-2`;
const SelectButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 self-start`;

const DeliveryOptions = ({ setStep }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(setDireccion(0));
		dispatch(setCostoEnvio(0));
		dispatch(setDeliveryMethod(''));
	}, [dispatch]);

	const handleSelection = (method) => {
		dispatch(setDeliveryMethod(method));
		setStep(3);
		if (method === 'pickup') {
			dispatch(setDireccion(0));
			dispatch(setCostoEnvio(0));
		}
	};

	return (
		<Container>
			<Title>Selecciona el método de entrega</Title>
			<Option onClick={() => handleSelection('delivery')}>Envío a domicilio</Option>
			<Option onClick={() => handleSelection('pickup')}>Retiro en local</Option>
			<SelectButton onClick={() => setStep(1)}>Volver</SelectButton>
		</Container>
	);
};

export default DeliveryOptions;
