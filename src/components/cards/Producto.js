import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { PrimaryButton as PrimaryButtonBase } from "components/misc/Buttons.js";
import { useDispatch } from "react-redux";
import { agregarItem } from "store/carritoSlice";
import { calcularPrecioConDescuento } from "utils/descuentoUtils";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Content = tw.div`flex flex-col lg:flex-row items-center`;
const ImageContainer = tw.div`flex-shrink-0 w-full lg:w-1/2 rounded-lg overflow-hidden shadow-lg`;
const Image = styled.img`
  ${tw`w-full h-full object-cover`}
  max-height: 400px;
`;
const Details = tw.div`mt-6 lg:mt-0 lg:ml-8 w-full lg:w-1/2`;
const Title = tw.h1`text-3xl font-bold text-primary-500 mb-4`;
const Description = tw.p`text-lg text-gray-700 mb-6 leading-relaxed`;
const PriceContainer = tw.div`mb-4 flex flex-col`;
const OriginalPrice = styled.p`
  ${tw`text-lg font-medium line-through text-red-500`}
`;
const DiscountedPrice = styled.p`
  ${tw`text-2xl font-semibold text-gray-900`}
`;
const DiscountList = styled.ul`
  ${tw`mt-4`}
`;
const DiscountItem = styled.li`
  ${tw`text-sm text-green-600`}
`;
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

const BackButton = styled.button`
  ${tw`flex items-center space-x-2 text-primary-500 font-semibold mb-4`}
  &:hover {
    ${tw`text-primary-700`}
  }
`;

const Producto = ({ producto }) => {
  const dispatch = useDispatch();
  const [cantidad, setCantidad] = useState(1);

  const precioConDescuento = calcularPrecioConDescuento(producto.precio, producto.descuentos || []);

  const handleAddToCart = () => {
    const productoConCantidad = { ...producto, cantidad, tipo:"producto" };
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

  const navigate = useNavigate();

  return (
    <Content>
      <BackButton onClick={() => navigate("/productos")}>
          <ArrowBackIcon fontSize="small" /> <span>Volver a productos</span>
       </BackButton>
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
        <PriceContainer>
          {producto.descuentos && producto.descuentos.length > 0 && (
            <>
              <OriginalPrice>${producto.precio.toFixed(2)}</OriginalPrice>
              <DiscountedPrice>${precioConDescuento.toFixed(2)}</DiscountedPrice>
            </>
          )}
          {!producto.descuentos || producto.descuentos.length === 0 ? (
            <DiscountedPrice>${producto.precio.toFixed(2)}</DiscountedPrice>
          ) : null}
        </PriceContainer>
        {producto.descuentos && producto.descuentos.length > 0 && (
          <DiscountList>
            {producto.descuentos.map((item) => (
              <DiscountItem key={item.id}>
                {item.descuento.descripcion} -{" "}
                {item.descuento.tipo === "PORCENTAJE"
                  ? `${(item.descuento.valor * 100).toFixed(2)}%`
                  : `$${item.descuento.valor.toFixed(2)}`}
              </DiscountItem>
            ))}
          </DiscountList>
        )}
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
  );
};

export default Producto;