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
import CheckoutProButton from "./CheckoutProMP";
import { initMercadoPago } from "@mercadopago/sdk-react";
import { useSearchParams } from "react-router-dom";
import CheckoutStatusModal from "./StatusScreenModal";
import TransferenciaModal from "./TransferenciaModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Container = tw.div`p-6 bg-white rounded-lg w-full mx-auto mt-8`;
const Content = tw.div`flex flex-col w-full`;
const ContentSection = tw.div`flex flex-col w-full items-center`;
const AddressSection = tw.div`mt-6 w-full bg-gray-100 p-4 rounded-lg shadow-md`;
const AddressItem = tw.div`flex justify-between items-center border-b pb-2 mb-2`;
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
const PaymentSection = tw.div`mt-8 p-6 bg-gray-100 rounded-lg shadow-md`;
const PaymentOption = tw.div`flex items-center mb-4`;
const Label = tw.label`ml-2 text-gray-700`;
const FinalizarCompraButton = tw.button`mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-800`;


const CartPage = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem('token'); // Asegúrate de que el token esté en el store
  const user = useSelector((state) => state.usuario); // ID del cliente desde el store
  const [preferenceId, setPreferenceId] = useState('');
  let userId = null;
  if(user.isLoggedIn){
    userId = user.userInfo.id;
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    initMercadoPago('APP_USR-28f591e9-5e20-4be6-b155-a96076aaf777', { locale: 'es-UY' });
  }, []);
  const [paymentId, setPaymentId] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const payment = searchParams.get('payment_id'); // Captura el parámetro "status" de la URL
    if(payment){
      setPaymentId(payment);
      setIsModalOpen(true);
    }
    // Limpiar los parámetros de la URL
    const newUrl = window.location.origin + window.location.pathname; // Construye la nueva URL sin parámetros
    window.history.replaceState({}, document.title, newUrl); // Reemplaza la URL actual
  }, [searchParams]);

  // Get cart items
  const cartItems = useSelector((state) => state.carrito.items);

  // Get cart items
  const pedidoId = useSelector((state) => state.carrito.pedidoId);

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
    setPreferenceId('');
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

  const [direcciones, setDirecciones] = useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [isLoadingDirecciones, setIsLoadingDirecciones] = useState(true);
  const [isOpenDirecciones, setIsOpenDirecciones] = useState(false);

  const seleccionarDireccion = (id) => {
    setDireccionSeleccionada(id);
  };

  const fetchDirecciones = async () => {
    try {
      const response = await fetch(`/direcciones?cliente_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setDirecciones(data);

        const direccionDefault = data.find((direccion) => direccion.predeterminado);
        if (direccionDefault) {
          setDireccionSeleccionada(direccionDefault.id);
        }
      } else {
        console.error("Error al obtener las direcciones:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener las direcciones:", error);
    } finally {
      setIsLoadingDirecciones(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDirecciones();
    }
  }, [userId]);

  const [isOpenAgendar, setIsOpenAgendar] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [fechasOcupadas, setFechasOcupadas] = useState([]);

  useEffect(() => {
    const fetchFechasOcupadas = async () => {
      try {
        const response = await fetch("/api/fechas-ocupadas", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setFechasOcupadas(data.fechas);
      } catch (error) {
        console.error("Error al obtener fechas ocupadas:", error);
      }
    };
    fetchFechasOcupadas();
  }, [token]);

  const isDateDisabled = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return fechasOcupadas.includes(formattedDate);
  };

  const handleMercadoPago = async () => {
    const BASE_URL = process.env.REACT_APP_URL || "http://localhost:3000";
    const items = cartItems.map((item) => ({
      id: item.id,
      title: item.descripcion || item.nombre,
      quantity: item.cantidad,
      unitPrice: item.precio,
    }));

    const backUrls = {
      success: `${BASE_URL}/carrito`,
      pending: `${BASE_URL}/carrito`,
      failure: `${BASE_URL}/carrito`
    };
    
    try {
      const response = await fetch("/pagos/crearPreferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
        body: JSON.stringify({ items, backUrls, userId}),
      });

      const data = await response.json();
      if (data) {
        setPreferenceId(data.preference_id);
      } else {
        alert("Error al generar la preferencia de pago.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al procesar el pago.");
    }
    
  };

  const [metodoPago, setMetodoPago] = useState(""); // Almacena el método de pago seleccionado
  const [mostrarModalTransferencia, setMostrarModalTransferencia] =
    useState(false); // Estado para mostrar el modal

  const handleSeleccionMetodoPago = (metodo) => {
    setMetodoPago(metodo);
    setPreferenceId('');
  };

  const handleFinalizarCompraTransferencia = () => {
    setMostrarModalTransferencia(true);
  };

  return (
    <Container>
      <Content>
        {cartItems.length > 0 ? (
          cartItems.map((item) => {
            const descuentos = obtenerDescuentos(item);
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
      <Content>
        <SectionTitle onClick={() => setIsOpen(!isOpen)}>
          Opciones de Envío
          <span>{isOpen ? "▲" : "▼"}</span>
        </SectionTitle>
        <ContentSection>
        <CollapsibleContent isOpen={isOpen}>
          <div tw="mt-6 w-full text-left">
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
        </ContentSection>
        <SectionTitle onClick={() => setIsOpenAgendar(!isOpenAgendar)}>
              Agendar Envío
              <span>{isOpenAgendar ? "▲" : "▼"}</span>
            </SectionTitle>
            <ContentSection>
              <CollapsibleContent isOpen={isOpenAgendar}>
                <DatePicker
                  selected={fechaSeleccionada}
                  onChange={(date) => setFechaSeleccionada(date)}
                  minDate={new Date().setDate(new Date().getDate() + 1)}
                  filterDate={(date) => !isDateDisabled(date)}
                  inline
                />
                {fechaSeleccionada && (
                  <p tw="text-sm text-green-600">
                    Fecha seleccionada: {fechaSeleccionada.toLocaleDateString()}
                  </p>
                )}
              </CollapsibleContent>
            </ContentSection>
      </Content>
      <Content>
        <SectionTitle onClick={() => setIsOpenDirecciones(!isOpenDirecciones)}>
          Direcciones
          <span>{isOpenDirecciones ? "▲" : "▼"}</span>
        </SectionTitle>
        <CollapsibleContent isOpen={isOpenDirecciones}>
            <AddressSection>
              {isLoadingDirecciones ? (
                <p>Cargando direcciones...</p>
              ) : direcciones.length > 0 ? (
                direcciones.map((direccion) => (
                  <AddressItem
            key={direccion.id}
            onClick={() => seleccionarDireccion(direccion.id)}
            style={{
              backgroundColor:
                direccionSeleccionada === direccion.id ? "#99cdb6" : "#f7f7f7",
              cursor: "pointer",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <div>
              <p tw="text-sm font-semibold">{direccion.titulo}</p>
              <p>{direccion.barrio}</p>
              <p>{direccion.direccion}</p>
            </div>
            {direccion.predeterminado && <p tw="text-green-500">Predeterminada</p>}
          </AddressItem>
                ))
              ) : (
                <p>No tienes direcciones registradas.</p>
              )}
            </AddressSection>
            </CollapsibleContent>
        </Content>
      <br/>
      <div tw="mt-6">
        <h3 tw="text-lg font-semibold">Resumen Total</h3>
        <p>Subtotal: ${Math.round(subtotal)}</p>
        <p>Envío: ${Math.round(costoEnvio)}</p>
        <p>Total: ${Math.round(total)}</p>
      </div>
      <PaymentSection>
        <SectionTitle>Métodos de Pago</SectionTitle>
        <PaymentOption>
          <input
            type="radio"
            id="mercado-pago"
            name="metodo-pago"
            value="mercado-pago"
            onChange={() => {
              handleSeleccionMetodoPago("mercado-pago");
              handleMercadoPago(); // Llamada a la función cuando se selecciona Mercado Pago
            }}
          />
          <Label htmlFor="mercado-pago">Pagar con Mercado Pago</Label>
        </PaymentOption>
        <PaymentOption>
          <input
            type="radio"
            id="transferencia"
            name="metodo-pago"
            value="transferencia"
            onChange={() => handleSeleccionMetodoPago("transferencia")}
          />
          <Label htmlFor="transferencia">Pagar por Transferencia</Label>
        </PaymentOption>

        {metodoPago === "mercado-pago" && preferenceId &&(
          <div tw="mt-4">
            <CheckoutProButton preferenceId={preferenceId}/>
          </div>
        )}

        {metodoPago === "transferencia" && (
          <FinalizarCompraButton onClick={handleFinalizarCompraTransferencia}>
            Finalizar Compra
          </FinalizarCompraButton>
        )}
      </PaymentSection>
      <TransferenciaModal mostrarModalTransferencia={mostrarModalTransferencia} setMostrarModalTransferencia={setMostrarModalTransferencia} pedidoId={pedidoId} token={token} dispatch={dispatch}/>
      </>
    )}
    <CheckoutStatusModal payment={paymentId} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} token={token} pedidoId={pedidoId} dispatch={dispatch}/>
    </Container>
  );
};

export default CartPage;