// components/cart/CartList.js
import React from 'react';
import CartItem from './CartItem';
import tw from 'twin.macro';

const ListContainer = tw.div`flex flex-col w-full`;
const Title = tw.h2`text-2xl font-bold mb-4`;
const NextButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800 self-end`;

const CartList = ({
	cartItems,
	handleIncrement,
	handleDecrement,
	handleQuitarCarrito,
	calcularSubtotalItem,
	obtenerDescuentos,
	calcularPrecioConDescuento,
	setStep,
}) => {
	return (
		<ListContainer>
			<Title>Tu Carrito</Title>
			{cartItems.length > 0 ? (
				cartItems.map((item) => (
					<CartItem
						key={`${item.id}-${item.tipo}`}
						item={item}
						handleIncrement={handleIncrement}
						handleDecrement={handleDecrement}
						handleQuitarCarrito={handleQuitarCarrito}
						calcularSubtotalItem={calcularSubtotalItem}
						obtenerDescuentos={obtenerDescuentos}
						calcularPrecioConDescuento={calcularPrecioConDescuento}
					/>
				))
			) : (
				<p>Tu carrito está vacío</p>
			)}
			{cartItems.length > 0 && <NextButton onClick={() => setStep(2)}>Continuar</NextButton>}
		</ListContainer>
	);
};

export default CartList;
