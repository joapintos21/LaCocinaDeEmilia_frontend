import React, { useState } from 'react';
import tw from "twin.macro";
import Modal from 'react-modal';
import MapComponent from './MapComponent';

const DireccionesModal = ({ userId, mostrarModalDirecciones, setMostrarModalDirecciones, onGuardarDireccion }) => {
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [predeterminado, setPredeterminado] = useState(false);
  const Titulo = tw.h2`text-lg font-bold`;

  const handleDireccionSeleccionada = ({ direccion, coordenadas }) => {
    setDireccionSeleccionada({ direccion, coordenadas });
  };

  const handleConfirmar = () => {
    if (direccionSeleccionada && titulo.trim()) {
      const nuevaDireccion = {
        cliente_id: userId, // Esto deberías tomarlo de tu contexto o estado global
        titulo,
        predeterminado,
        latitud: direccionSeleccionada.coordenadas.lat,
        longitud: direccionSeleccionada.coordenadas.lng,
        direccion: direccionSeleccionada.direccion,
      };

      console.log("Dirección a guardar:", nuevaDireccion);

      // Llama a la función para enviar los datos al backend
      onGuardarDireccion(nuevaDireccion);

      // Cierra el modal
      setMostrarModalDirecciones(false);

      // Limpia los campos
      setTitulo("");
      setPredeterminado(false);
      setDireccionSeleccionada(null);
    } else {
      alert("Por favor, complete todos los campos e indique una dirección válida.");
    }
  };

  return (
    <div>
      <Modal
        isOpen={mostrarModalDirecciones}
        onRequestClose={() => setMostrarModalDirecciones(false)}
        contentLabel="Tus Direcciones"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '800px',
            padding: '20px',
            borderRadius: '10px',
          },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
        }}
      >
        <Titulo>Agregar Dirección</Titulo>

        <div style={{ marginBottom: "10px" }}>
          <label>
            Nombre de la Dirección:
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ejemplo: Casa, Trabajo"
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "5px",
                border: "1px solid #ccc",
                borderRadius: "5px",
              }}
            />
          </label>
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="checkbox"
              checked={predeterminado}
              onChange={(e) => setPredeterminado(e.target.checked)}
              style={{ marginRight: "10px" }}
            />
            Marcar como predeterminada
          </label>
        </div>
        <MapComponent onDireccionSeleccionada={handleDireccionSeleccionada} />
        <button
          onClick={handleConfirmar}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#99cdb6',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Confirmar
        </button>
      </Modal>
    </div>
  );
};

export default DireccionesModal;