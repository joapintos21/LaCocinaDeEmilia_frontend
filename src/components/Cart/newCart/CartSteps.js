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
const LeftColumn = tw.div`w-full pr-4`;
const ProgressBarContainer = tw.div`w-full bg-gray-200 rounded-full h-4 mb-4`;
const ProgressBar = tw.div`bg-blue-500 h-4 rounded-full`;
const StepDescription = tw.div`text-center text-lg font-semibold mb-2`;

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

	const stepDescriptions = ['Paso 1 de 4', 'Paso 2 de 4', 'Paso 3 de 4', 'Paso 4 de 4'];

	const calculateProgress = () => {
		return (step / 4) * 100;
	};

	return (
		<>
			<StepDescription>{stepDescriptions[step - 1]}</StepDescription>
			<ProgressBarContainer>
				<ProgressBar style={{ width: `${calculateProgress()}%` }} />
			</ProgressBarContainer>
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
		</>
	);
};

export default CartSteps;
