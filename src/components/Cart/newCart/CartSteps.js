// components/cart/CartSteps.js
import React, { useState } from 'react';
import CartList from './CartList';
import DeliveryOptions from './DeliveryOptions';
import ShippingScheduler from './ShippingScheduler';
import AddressSelector from './AddressSelector';
import PaymentSelector from './PaymentSelector';
import tw from 'twin.macro';
import PickUpScheduler from './PickUpScheduler';

const Container = tw.div`flex flex-row w-full p-6`;
const LeftColumn = tw.div`w-2/3 pr-4`;

const CartSteps = ({
	cartItems,
	costoEnvio,
	comisionMP,
	metodoPago,
	setMetodoPago,
	handleMercadoPago,
	preferenceId,
	setPreferenceId,
	handleIncrement,
	handleDecrement,
	handleQuitarCarrito,
	calcularSubtotalItem,
	obtenerDescuentos,
	calcularPrecioConDescuento,
	direccionId,
	setFechaSeleccionada,
	deliveryMethod,
}) => {
	const [step, setStep] = useState(1);

	return (
		<Container>
			<LeftColumn>
				{step === 1 && (
					<CartList
						cartItems={cartItems}
						handleIncrement={handleIncrement}
						handleDecrement={handleDecrement}
						handleQuitarCarrito={handleQuitarCarrito}
						calcularSubtotalItem={calcularSubtotalItem}
						obtenerDescuentos={obtenerDescuentos}
						calcularPrecioConDescuento={calcularPrecioConDescuento}
						setStep={setStep}
					/>
				)}
				{step === 2 && <DeliveryOptions setStep={setStep} />}
				{step === 3 && deliveryMethod === 'delivery' && (
					<>
						<ShippingScheduler setStep={setStep} setFechaSeleccionada={setFechaSeleccionada} />
						<AddressSelector step={step} setStep={setStep} direccionId={direccionId} />
					</>
				)}
				{step === 3 && deliveryMethod === 'pickup' && (
					<PickUpScheduler setStep={setStep} setFechaSeleccionada={setFechaSeleccionada} />
				)}
				{step === 4 && (
					<PaymentSelector
						setStep={setStep}
						metodoPago={metodoPago}
						setMetodoPago={setMetodoPago}
						handleMercadoPago={handleMercadoPago}
						setPreferenceId={setPreferenceId}
						deliveryMethod={deliveryMethod}
					/>
				)}
			</LeftColumn>
		</Container>
	);
};

export default CartSteps;
