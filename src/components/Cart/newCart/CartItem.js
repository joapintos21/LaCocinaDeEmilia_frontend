// components/cart/CartItem.js
import React from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';

const CartItemContainer = tw.div`flex flex-row items-center bg-white w-full rounded-lg p-4 shadow mb-4`;
const Image = tw.img`w-20 h-20 rounded mr-4`;
const Info = tw.div`flex-1`;
const Name = tw.h4`text-lg font-bold`;
const Price = tw.p`text-gray-600`;
const OriginalPrice = styled.p`
	${tw`line-through text-red-500`}
`;
const DiscountInfo = tw.p`text-sm text-green-600`;
const Actions = tw.div`flex items-center space-x-4`;
const Quantity = tw.div`flex items-center space-x-2`;
const Button = tw.button`px-3 py-1 bg-gray-200 rounded hover:bg-gray-300`;

const CartItem = ({
	item,
	handleIncrement,
	handleDecrement,
	handleQuitarCarrito,
	calcularSubtotalItem,
	obtenerDescuentos,
	calcularPrecioConDescuento,
}) => {
	const descuentos = obtenerDescuentos(item);
	const precioConDescuento = calcularPrecioConDescuento(item.precio, descuentos);
	const descuentoAplicado = item.precio - precioConDescuento;

	return (
		<CartItemContainer>
			<Image
				src={
					item.imagen ||
					'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80'
				}
				alt={item.descripcion}
			/>
			<Info>
				<Name>{item.descripcion}</Name>
				{item.adicional && (
					<p tw="text-sm text-gray-600">
						Adicional: {item.adicional.descripcion} (+${item.adicional.costoAdicional.toFixed(2)})
					</p>
				)}
				{descuentoAplicado > 0 && <OriginalPrice>${item.precio.toFixed(2)}</OriginalPrice>}
				<Price>${precioConDescuento.toFixed(2)}</Price>
				{descuentoAplicado > 0 && (
					<DiscountInfo>Ahorras ${descuentoAplicado.toFixed(2)} gracias a descuentos aplicados.</DiscountInfo>
				)}
				<Price>Total: ${calcularSubtotalItem(item).toFixed(2)}</Price>
			</Info>
			<Actions>
				<Quantity>
					<Button onClick={() => handleDecrement(item)}>-</Button>
					<span>{item.cantidad}</span>
					<Button onClick={() => handleIncrement(item)}>+</Button>
				</Quantity>
				<Button onClick={() => handleQuitarCarrito(item)} tw="bg-red-500 text-white hover:bg-red-700">
					Quitar
				</Button>
			</Actions>
		</CartItemContainer>
	);
};

export default CartItem;
