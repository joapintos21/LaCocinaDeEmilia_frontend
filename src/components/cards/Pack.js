import React, { useState } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { PrimaryButton as PrimaryButtonBase } from 'components/misc/Buttons.js';
import { useDispatch, useSelector } from 'react-redux';
import { calcularPrecioConDescuento } from 'utils/descuentoUtils';
import { handleAddToCart } from 'utils/carritoUtils';

const Content = tw.div`flex flex-col items-center`;
const Details = tw.div`w-full`;
const Title = tw.h1`text-3xl font-bold text-primary-500 mb-4 text-center`;
const Description = tw.p`text-lg text-gray-700 mb-6 leading-relaxed text-center`;
const DiscountList = tw.div`text-green-600 italic text-center mb-4`;
const PriceContainer = tw.div`mb-4 text-center`;
const DiscountedPrice = styled.p`
	${tw`text-2xl font-semibold text-gray-900`}
`;
const ProductList = tw.div`mt-6 w-full`;
const ProductItem = tw.div`flex items-center p-4 border-b border-gray-300`;
const ProductImage = styled.div`
	${tw`w-20 h-20 bg-center bg-cover rounded-md mr-4`}
	${(props) => `background-image: url("${props.imageSrc}");`}
`;
const ProductDetails = tw.div`flex-1`;
const ProductName = tw.p`text-gray-900 font-semibold`;
const ProductQuantity = tw.span`text-sm text-gray-600`;
const ButtonContainer = tw.div`flex justify-center mt-4`;
const QuantityContainer = tw.div`flex justify-center mt-4`;

const QuantityButton = styled.button`
	${tw`px-3 py-1 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300`}
`;

const QuantityInput = styled.input`
	${tw`w-12 text-center border border-gray-300 rounded-md`}
`;

const PrimaryButton = styled(PrimaryButtonBase)`
	${tw`px-6 py-3 bg-primary-500 text-white font-medium rounded-lg shadow-lg`}
	&:hover {
		${tw`bg-primary-700`}
	}
`;

const Pack = ({ pack }) => {
	const dispatch = useDispatch();
	const [cantidad, setCantidad] = useState(1);
	const token = sessionStorage.getItem('token'); // Asegúrate de que el token esté en el store
	const user = useSelector((state) => state.usuario); // ID del cliente desde el store
	let userId = null;
	if (user.isLoggedIn) {
		userId = user.userInfo.id;
	}

	const precioConDescuento = calcularPrecioConDescuento(pack.precio, pack.descuentos || []);

	const handleAgregarACarrito = () => {
		handleAddToCart(pack, cantidad, token, userId, 'pack', dispatch)
			.then(() => {
				alert('Pack agregado al carrito');
			})
			.catch((e) => {
				alert(e.message);
			});
	};

	const incrementarCantidad = () => {
		setCantidad((prevCantidad) => prevCantidad + 1);
	};

	const decrementarCantidad = () => {
		setCantidad((prevCantidad) => (prevCantidad > 1 ? prevCantidad - 1 : 1));
	};

	const handleCantidadChange = (e) => {
		const value = parseInt(e.target.value, 10);
		setCantidad(isNaN(value) || value <= 0 ? 1 : value);
	};

	return (
		<Content>
			<Details>
				<Title>{pack.nombre || 'Pack sin título'}</Title>
				<Description>{pack.descripcion || 'Este pack no tiene descripción disponible.'}</Description>

				{/* Mostrar los descuentos del pack */}
				{pack.descuentos && pack.descuentos.length > 0 && (
					<DiscountList>
						{pack.descuentos.map((descuentoPack, index) => (
							<p key={index}>
								{descuentoPack.descuento.descripcion || 'Descuento'}:{' '}
								{descuentoPack.descuento.tipo === 'PORCENTAJE' ?
									`-${(descuentoPack.descuento.valor * 100).toFixed(2)}%`
								:	`-$${descuentoPack.descuento.valor.toFixed(2)}`}
							</p>
						))}
					</DiscountList>
				)}

				<PriceContainer>
					<DiscountedPrice>Total: ${precioConDescuento.toFixed(2)}</DiscountedPrice>
				</PriceContainer>

				<ProductList>
					{pack.productos && pack.productos.length > 0 ?
						pack.productos.map((producto, index) => (
							<ProductItem key={index}>
								<ProductImage
									imageSrc={
										producto.image ||
										'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80'
									}
								/>
								<ProductDetails>
									<ProductName>{producto.descripcion}</ProductName>
									<ProductQuantity>Cantidad: {producto.cantidad}</ProductQuantity>
								</ProductDetails>
							</ProductItem>
						))
					:	<p>No hay productos en este pack.</p>}
				</ProductList>

				<QuantityContainer>
					<QuantityButton onClick={decrementarCantidad}>-</QuantityButton>
					<QuantityInput type="number" value={cantidad} onChange={handleCantidadChange} min="1" />
					<QuantityButton onClick={incrementarCantidad}>+</QuantityButton>
				</QuantityContainer>
				<ButtonContainer>
					<PrimaryButton onClick={handleAgregarACarrito}>Agregar al carrito</PrimaryButton>
				</ButtonContainer>
			</Details>
		</Content>
	);
};

export default Pack;
