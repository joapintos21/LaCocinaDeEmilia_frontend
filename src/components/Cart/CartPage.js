import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { incrementarCantidad, decrementarCantidad, quitarItem } from "store/carritoSlice";

const Container = tw.div`p-6 bg-gray-100 min-h-screen`;
const CartItem = tw.div`flex items-center bg-white rounded-lg p-4 shadow mb-4`;
const Image = tw.img`w-16 h-16 rounded mr-4`;
const Info = tw.div`flex-1`;
const Name = tw.h4`text-lg font-bold`;
const Price = tw.p`text-gray-600`;
const Actions = tw.div`flex items-center space-x-4`;
const Quantity = tw.div`flex items-center space-x-2`;
const Button = tw.button`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300`;

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.carrito.items);

  const handleIncrement = (item) => {
    dispatch(incrementarCantidad(item.id));
  };

  const handleDecrement = (item) => {
    if (item.cantidad > 1) {
      dispatch(decrementarCantidad(item.id));
    } else {
      dispatch(quitarItem(item.id));
    }
  };

  return (
    <Container>
      <h2 tw="text-xl font-bold mb-6">Tu Carrito</h2>
      {cartItems.length > 0 ? (
        cartItems.map((item) => (
          <CartItem key={item.id}>
            <Image src={item.imageSrc || "https://via.placeholder.com/150"} alt={item.title} />
            <Info>
              <Name>{item.descripcion}</Name>
              <Price>${item.precio}</Price>
              <Price>Total: ${item.precio * item.cantidad}</Price>
            </Info>
            <Actions>
              <Quantity>
                <Button onClick={() => handleDecrement(item)}>-</Button>
                <span>{item.cantidad}</span>
                <Button onClick={() => handleIncrement(item)}>+</Button>
              </Quantity>
              <Button onClick={() => dispatch(quitarItem(item.id))} tw="bg-red-500 text-white hover:bg-red-700">
                Quitar
              </Button>
            </Actions>
          </CartItem>
        ))
      ) : (
        <p tw="text-gray-600">Tu carrito está vacío</p>
      )}
    </Container>
  );
};

export default CartPage;