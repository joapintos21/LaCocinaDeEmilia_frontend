import React, { useState, useEffect } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import {
  decrementarCantidad,
  quitarItem,
  setCostoEnvio,
} from "store/carritoSlice";
import { calcularPrecioConDescuento } from "utils/descuentoUtils";
import { handleAddToCart, handleQuitarDeCarrito } from "utils/carritoUtils";
import ZonasMapa from "images/ZONAS.png";
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
initMercadoPago('TEST-75db8543-5df6-4a02-80f8-a98db92fd464');

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
  const token = sessionStorage.getItem('token'); // Asegúrate de que el token esté en el store
  const user = useSelector((state) => state.usuario); // ID del cliente desde el store
  let userId = null;
  if(user.isLoggedIn){
    userId = user.userInfo.id;
  }

  // Get cart items
  const cartItems = useSelector((state) => state.carrito.items);

  // Get products and packs from their respective slices
  const productosRedux = useSelector((state) => state.productos);
  const packsRedux = useSelector((state) => state.packs);
  
  const [isOpen, setIsOpen] = useState(false);

  const SectionTitle = tw.h3`text-lg font-bold cursor-pointer flex justify-between items-center`;
  const CollapsibleContent = styled.div`
    ${({ isOpen }) => (isOpen ? tw`block` : tw`hidden`)}
    ${tw`mt-4`}
  `;  

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

  const costoEnvio = useSelector((state) => state.carrito.costoEnvio);
  const subtotal = cartItems.reduce((acc, item) => acc + calcularPrecioConDescuento(item.precioTotal, obtenerDescuentos(item)), 0);
  const total = subtotal + costoEnvio;
  const [zonaSeleccionada, setZonaSeleccionada] = useState(null);
  
  const opcionesEnvio = [
    { id: 1, zona: "Verde", costo: 180, descripcion: "Zona Verde (gratis a partir de $1500 en compras)" },
    { id: 2, zona: "Roja", costo: 200, descripcion: "Zona Roja" },
    { id: 3, zona: "Amarilla", costo: 250, descripcion: "Zona Amarilla" },
    { id: 4, zona: "Otros", costo: 0, descripcion: "Otros" },
  ];

  const handleSeleccionEnvio = (costo, idZona) => {
    const subtotal = cartItems.reduce((acc, item) => acc + calcularPrecioConDescuento(item.precioTotal, obtenerDescuentos(item)), 0);
  
    if (idZona === 1) { // Zona Verde
      if (subtotal >= 1500) {
        dispatch(setCostoEnvio(0)); // Envío gratuito
      } else {
        dispatch(setCostoEnvio(costo));
      }
    } else {
      dispatch(setCostoEnvio(costo));
    }
  
    setZonaSeleccionada(idZona); // Almacena la zona seleccionada
  };
  
  useEffect(() => {
    if (cartItems.length === 0) {
      setZonaSeleccionada(null);
      dispatch(setCostoEnvio(0));
    } else if (zonaSeleccionada === 1) {
      if (subtotal >= 1500) {
        dispatch(setCostoEnvio(0));
      } else {
        dispatch(setCostoEnvio(180));
      }
    }
  }, [cartItems.length, subtotal, zonaSeleccionada, dispatch]);

  const handleIncrement = (item) => {
    handleAddToCart(item, 1, token, userId, item.tipo, dispatch);
  };

  const handleDecrement = (item) => {
    handleQuitarDeCarrito(userId, item.id, 1, item.tipo, token);
    dispatch(decrementarCantidad(item));
  };

  const handleQuitarCarrito = (item) => {
    handleQuitarDeCarrito(userId, item.id, item.cantidad, item.tipo, token);
    dispatch(quitarItem(item));
  }

  const handleMercadoPago = async () => {
    const items = cartItems.map((item) => ({
    title: item.descripcion,
    quantity: item.cantidad,
    unitPrice: item.precio,
    }));
    
        try {
          const response = await fetch("/pagos/crearPreferencia", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            body: JSON.stringify({ items }),
          });
    
          const data = await response.json();
          if (data) {
            console.log(data)
          } else {
            alert("Error al generar la preferencia de pago.");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Ocurrió un error al procesar el pago.");
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
                    onClick={() => handleQuitarCarrito(item)}
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
      {cartItems.length > 0 && (
      <>
      <h2 tw="text-xl font-bold mb-6">Envío</h2>
      <Content>
        <SectionTitle onClick={() => setIsOpen(!isOpen)}>
          Opciones de Envío
          <span>{isOpen ? "▲" : "▼"}</span>
        </SectionTitle>
        <CollapsibleContent isOpen={isOpen}>
          <div tw="mt-6 w-full text-left">
            <h3 tw="text-lg font-semibold mb-4">Opciones de Envío</h3>
            <img
              src={ZonasMapa}
              alt="Mapa de zonas de envío"
              tw="w-full h-auto rounded-lg shadow mb-4"
            />
            {opcionesEnvio.map((opcion) => (
            <div key={opcion.id}>
              <input
                type="radio"
                name="envio"
                value={opcion.costo}
                onChange={() => handleSeleccionEnvio(opcion.costo, opcion.id)}
                checked={zonaSeleccionada === opcion.id}
              />
              <label
                htmlFor={`envio-${opcion.id}`}
                tw="ml-2 cursor-pointer"
              >
                {' ' + opcion.descripcion + ' '} - {opcion.costo === 0 ? "Consultar" : '$' + opcion.costo}
              </label>
            </div>
          ))}
          </div>
        </CollapsibleContent>
      </Content>
      <div tw="mt-6">
        <h3 tw="text-lg font-semibold">Resumen Total</h3>
        <p>Subtotal: ${Math.round(subtotal)}</p>
        <p>Envío: ${Math.round(costoEnvio)}</p>
        <p>Total: ${Math.round(total)}</p>
      </div>
      </>
      )}
    <button onClick={handleMercadoPago}>Pagar con Mercado Pago</button>
    <Wallet initialization={{ preferenceId: "175019083-317cd3e6-ba22-4ac6-be05-89375c0d0220" }} customization={{ texts:{ valueProp: 'smart_option'}}} />
    </Container>
  );
};

export default CartPage;