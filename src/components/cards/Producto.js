import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { useDispatch } from "react-redux";
import { agregarItem } from "store/carritoSlice";

const Content = tw.div`flex flex-col lg:flex-row items-center`;
const ImageContainer = tw.div`flex-shrink-0 w-full lg:w-1/2 rounded-lg overflow-hidden shadow-lg`;
const Image = styled.img`
  ${tw`w-full h-full object-cover`}
  max-height: 400px;
`;
const Details = tw.div`mt-6 lg:mt-0 lg:ml-8 w-full lg:w-1/2`;
const Title = tw.h1`text-3xl font-bold text-primary-500 mb-4`;
const Description = tw.p`text-lg text-gray-700 mb-6 leading-relaxed`;
const Price = tw.p`text-2xl font-semibold text-gray-900 mb-4`;
const ButtonContainer = tw.div`flex space-x-4 mt-4`;
const QuantityContainer = tw.div`flex items-center space-x-4`;

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

const Producto = ({ producto }) => {
  const dispatch = useDispatch();
  const [cantidad, setCantidad] = useState(1);

  const handleAddToCart = () => {
    const productoConCantidad = { ...producto, cantidad };
    dispatch(agregarItem(productoConCantidad));
    alert("Producto agregado al carrito");
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
        <ImageContainer>
          <Image
            src={
              producto.imageSrc ||
              "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
            }
            alt={producto.titulo}
          />
        </ImageContainer>
        <Details>
          <Title>{producto.descripcion || "Producto sin título"}</Title>
          <Description>
            {producto.descripcion || "Este producto no tiene descripción disponible."}
          </Description>
          <Price>${producto.precio || "0.00"}</Price>
          <QuantityContainer>
            <QuantityButton onClick={decrementarCantidad}>-</QuantityButton>
            <QuantityInput
              type="number"
              value={cantidad}
              onChange={handleCantidadChange}
              min="1"
            />
            <QuantityButton onClick={incrementarCantidad}>+</QuantityButton>
          </QuantityContainer>
          <ButtonContainer>
            <PrimaryButton onClick={handleAddToCart}>Agregar al carrito</PrimaryButton>
          </ButtonContainer>
        </Details>
      </Content>
  )
}

export default Producto;