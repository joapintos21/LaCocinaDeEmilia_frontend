import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { obtenerPedidos } from "scripts/obtenerPedidos";
import { useSelector } from "react-redux";
import { obtenerPedidoCliente } from "scripts/showPedidoCliente";

const Container = tw.div`p-6 bg-white rounded-lg w-full mx-auto`;
const Title = tw.h2`text-2xl font-bold mb-6 text-center`;
const PedidoCard = tw.div`bg-gray-100 p-4 rounded-lg shadow mb-4 cursor-pointer`;
const PedidoHeader = tw.div`flex justify-between items-center`;
const Estado = styled.span`
  ${tw`px-3 py-1 rounded-full text-sm font-semibold`}
  ${({ estado }) => {
	switch (estado) {
	  case 1:
		return tw`bg-blue-200 text-blue-700`;
	  case 2:
		return tw`bg-yellow-200 text-yellow-700`;
	  case 3:
		return tw`bg-green-200 text-green-700`;
	  case 4:
		return tw`bg-gray-200 text-gray-700`;
	  default:
		return tw`bg-red-200 text-red-700`;
	}
  }}
`;
const Total = tw.p`text-lg font-bold text-gray-700`;
const Fecha = tw.p`text-sm text-gray-500`;
const ProductosList = tw.div`mt-4 border-t pt-4`;
const ProductoItem = tw.div`flex justify-between items-center py-2`;
const ProductoNombre = tw.p`text-gray-700 font-medium`;
const ProductoCantidad = tw.p`text-gray-500`;
const ProductoPrecio = tw.p`text-gray-700 font-semibold`;

const estadosPedidos = {
  1: "Su pedido está siendo procesado",
  2: "Estamos preparando su pedido",
  3: "Pedido listo para su envío",
  4: "Pedido entregado",
};

const PedidosPage = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const user = useSelector((state) => state.usuario.userInfo)
  const token = sessionStorage.getItem("token")

  const togglePedido = (id) => {
	setPedidoSeleccionado((prev) => (prev === id ? null : id));
  };

// Cargar productos y packs desde Redux
  useEffect(() => {
	const fetchPedidos = async () => {
	  await obtenerPedidos(user.id, token).then((data) => {
		setPedidos(data)
	  });
	};
	fetchPedidos();
  }, []);

  useEffect(() => {
	if(pedidoSeleccionado){
		const pedido = pedidos.filter((pedido) => pedido.id === pedidoSeleccionado)
		setProductos(pedido[0].detalles)
	}
  }, [pedidoSeleccionado]);

  return (
	<Container>
	  <Title>Mis Pedidos</Title>
	  {pedidos.map((pedido) => (
		<PedidoCard key={pedido.id} onClick={() => togglePedido(pedido.id)}>
		  <PedidoHeader>
			<div>
			  <Estado estado={pedido.estado}>
				{estadosPedidos[pedido.estado]}
			  </Estado>
			  <Fecha>Fecha: {pedido.fechaCreacion}</Fecha>
			</div>
			<Total>${pedido.total}</Total>
		  </PedidoHeader>
		  {pedidoSeleccionado === pedido.id && (
			<ProductosList>
			  {productos.map((producto, index) => (
				<ProductoItem key={index}>
				  <ProductoNombre>{producto.descripcion}</ProductoNombre>
				  <ProductoCantidad>
					Cantidad: {producto.cantidad}
				  </ProductoCantidad>
				  <ProductoPrecio>${producto.subtotal}</ProductoPrecio>
				</ProductoItem>
			  ))}
			</ProductosList>
		  )}
		</PedidoCard>
	  ))}
	</Container>
  );
};

export default PedidosPage;