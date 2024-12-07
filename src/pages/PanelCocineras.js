import React, { useState, useEffect } from "react";
import tw from "twin.macro";
import AnimationRevealPage from "helpers/AnimationRevealPage.js";
import Header from "components/headers/light.js";
const Container = tw.div`p-6 bg-white rounded-lg w-full mx-auto mt-8`;
const PedidoItem = tw.div`flex justify-between items-center border-b pb-2 mb-2 p-4 rounded-lg shadow-md bg-gray-100`;
const Button = tw.button`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700`;
const AssignButton = tw.button`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700`;
const SectionTitle = tw.h3`text-lg font-bold cursor-pointer flex justify-between items-center`;

const PanelCocineras = () => {
  const [pedidosSinAsignar, setPedidosSinAsignar] = useState([]);
  const [pedidosAsignados, setPedidosAsignados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("user_id");

  const fetchPedidos = async () => {
    try {
      const response = await fetch(`/api/pedidos/obtenerPedidosParaCocinera?usuario_id=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setPedidosSinAsignar(data.sinAsignar);
        setPedidosAsignados(data.asignados);
      } else {
        console.error("Error al obtener pedidos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al obtener pedidos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const asignarPedido = async (pedidoId) => {
    try {
      const response = await fetch(`/api/pedidos/asignar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pedido_id: pedidoId, cocinera_id: userId }),
      });
      if (response.ok) {
        fetchPedidos();
        alert("Pedido asignado correctamente");
      } else {
        console.error("Error al asignar pedido:", response.statusText);
      }
    } catch (error) {
      console.error("Error al asignar pedido:", error);
    }
  };

  const cambiarEstado = async (pedidoId) => {
    try {
      const response = await fetch(`/api/pedidos/cambiar-estado/${pedidoId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchPedidos();
        alert("Estado cambiado a 'LISTO_PARA_ENVIAR'");
      } else {
        console.error("Error al cambiar estado:", response.statusText);
      }
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  return (
    <AnimationRevealPage>
      <Header />
      <Container>
    {isLoading ? (
      <p>Cargando pedidos...</p>
    ) : (
      <>
        {/* Pedidos sin asignar */}
        <SectionTitle>Pedidos sin asignar</SectionTitle>
        {pedidosSinAsignar.length > 0 ? (
          pedidosSinAsignar.map((pedido) => (
            <PedidoItem key={pedido.id}>
              <div>
                <p>Pedido #{pedido.id}</p>
                <p>Cliente: {pedido.cliente_id}</p>
                <p>Total: ${pedido.total}</p>
              </div>
              <AssignButton onClick={() => asignarPedido(pedido.id)}>
                Asignarme
              </AssignButton>
            </PedidoItem>
          ))
        ) : (
          <p>No hay pedidos sin asignar.</p>
        )}

        {/* Pedidos asignados */}
        <SectionTitle>Mis pedidos asignados</SectionTitle>
        {pedidosAsignados.length > 0 ? (
          pedidosAsignados.map((pedido) => (
            <PedidoItem key={pedido.id}>
              <div>
                <p>Pedido #{pedido.id}</p>
                <p>Cliente: {pedido.cliente_id}</p>
                <p>Total: ${pedido.total}</p>
              </div>
              <Button onClick={() => cambiarEstado(pedido.id)}>
                Marcar como Listo para Enviar
              </Button>
            </PedidoItem>
          ))
        ) : (
          <p>No tienes pedidos asignados.</p>
        )}
      </>
    )}
  </Container>
    </AnimationRevealPage>
  );
};

export default PanelCocineras;