import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  incrementarCantidad,
  decrementarCantidad,
  quitarItem,
} from "store/carritoSlice";
import { calcularPrecioConDescuento } from "utils/descuentoUtils";

const Container = tw.div`p-6 bg-white rounded-lg w-full mx-auto mt-8`;
const Content = tw.div`flex flex-col w-full items-center`;
const Image = tw.img`w-16 h-16 rounded mr-4`;
const Name = tw.h4`text-lg font-bold`;
const Price = tw.p`text-gray-600`;
const OriginalPrice = styled.p`
${tw`line-through text-red-500`}
`;
const DiscountInfo = tw.p`text-sm text-green-600`;
const CartItem = tw.div`flex flex-col sm:flex-row items-center bg-white w-full rounded-lg p-4 shadow mb-4`;
const Info = tw.div`flex-1`;
const Actions = tw.div`flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0`;
const Quantity = tw.div`flex items-center space-x-2`;
const Button = tw.button`px-2 py-1 bg-gray-200 rounded hover:bg-gray-300`;

const CartPage = () => {
  const dispatch = useDispatch();

  // Get cart items
  const cartItems = useSelector((state) => state.carrito.items);

  // Get products and packs from their respective slices
  const productosRedux = useSelector((state) => state.productos);
  const packsRedux = useSelector((state) => state.packs);

  // Function to get discounts based on item type
  const obtenerDescuentos = (item) => {
    if (item.tipo === "producto") {
      const producto = productosRedux.find((prod) => prod.id === item.id);
      return producto ? producto.descuentos || [] : [];
    } else if (item.tipo === "pack") {
      const pack = packsRedux.find((pck) => pck.id === item.id);
      return pack ? pack.descuentos || [] : [];
    }
    return [];
  };

  const handleIncrement = (item) => {
    dispatch(incrementarCantidad(item));
  };

  const handleDecrement = (item) => {
    if (item.cantidad > 1) {
      dispatch(decrementarCantidad(item));
    } else {
      dispatch(quitarItem(item));
    }
  };

  return (
    <Container>
      <h2 tw="text-xl font-bold mb-6">Tu Carrito</h2>
      <Content>
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const descuentos = obtenerDescuentos(item); // Get discounts for the item
            const precioConDescuento = calcularPrecioConDescuento(item.precio, descuentos);
            const descuentoAplicado = item.precio - precioConDescuento;

            return (
              <CartItem key={`${item.id}-${item.tipo}`}>
                <Image src={item.imageSrc || "https://via.placeholder.com/150"} alt={item.descripcion} />
                <Info>
                  <Name>{item.descripcion}</Name>
                  {descuentoAplicado > 0 && (
                    <OriginalPrice>${item.precio.toFixed(2)}</OriginalPrice>
                  )}
                  <Price>${precioConDescuento.toFixed(2)}</Price>
                  {descuentoAplicado > 0 && (
                    <DiscountInfo>Ahorras ${descuentoAplicado.toFixed(2)} gracias a descuentos aplicados.</DiscountInfo>
                  )}
                  <Price>Total: ${(precioConDescuento * item.cantidad).toFixed(2)}</Price>
                </Info>
                <Actions>
                  <Quantity>
                    <Button onClick={() => handleDecrement(item)}>-</Button>
                    <span>{item.cantidad}</span>
                    <Button onClick={() => handleIncrement(item)}>+</Button>
                  </Quantity>
                  <Button
                    onClick={() => dispatch(quitarItem(item))}
                    tw="bg-red-500 text-white hover:bg-red-700"
                  >
                    Quitar
                  </Button>
                </Actions>
              </CartItem>
            );
          })
        ) : (
          <p tw="text-gray-600">Tu carrito está vacío</p>
        )}
      </Content>
    </Container>
  );
};

export default CartPage;