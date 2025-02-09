// components/cart/OrderSummary.js
import React from 'react';
import tw from 'twin.macro';

const Container = tw.div`flex flex-col bg-gray-100 p-6 rounded-lg shadow-md`;
const Title = tw.h2`text-xl font-bold mb-4`;
const Detail = tw.p`text-gray-700 mb-2`;
const Total = tw.p`text-lg font-bold text-blue-600 mt-4`;

const OrderSummary = ({ subtotal, costoEnvio, comisionMP, cupon }) => {
	let total = (subtotal + (costoEnvio > 0 ? costoEnvio : 0)) * (1 + (comisionMP > 0 ? comisionMP / 100 : 0));
	const getTotal = () => {
		if (cupon) {
			total = total * (1 - cupon.descuento.valor);
		}
		return total.toFixed(2);
	};

	return (
		<Container>
			<Title>Resumen de la Compra</Title>
			<Detail>Subtotal: ${subtotal.toFixed(2)}</Detail>
			{costoEnvio === -1 ? (
				<Detail tw="text-red-600">Envío: Coordina el costo de envío por WhatsApp</Detail>
			) : (
				<Detail>Envío: ${Math.round(costoEnvio)}</Detail>
			)}
			<Detail>Comisión Mercado Pago: {comisionMP > 0 ? `${comisionMP}%` : 'No aplica'}</Detail>
			{cupon && <Detail>Cupon: {cupon.codigo}</Detail>}
			<Total>Total: ${getTotal()}</Total>
		</Container>
	);
};

export default OrderSummary;
