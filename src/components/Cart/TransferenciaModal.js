import React, { useState } from 'react';
import { StatusScreen } from "@mercadopago/sdk-react";
import Modal from 'react-modal'; // Usar react-modal (o personalizar si no quieres usar dependencias)

const TransferenciaModal = ({ mostrarModalTransferencia, setMostrarModalTransferencia}) => {
  return (
    <div>
      {/* Modal */}
      <Modal
        isOpen={mostrarModalTransferencia}
        onRequestClose={() => setMostrarModalTransferencia(false)}
        contentLabel="Estado del Pago"
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: '500px',
            padding: '20px',
            borderRadius: '10px',
          },
          overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 tw="text-lg font-bold mb-4">Datos para la Transferencia</h3>
            <p tw="mb-4">Banco: Banco de Ejemplo</p>
            <p tw="mb-4">Número de cuenta: 123-456-789</p>
            <p tw="mb-4">CBU: 000123456789</p>
            <label tw="block mb-4">
              Número de comprobante:
              <input
                type="text"
                tw="w-full mt-2 p-2 border rounded"
                placeholder="Ingresa el número de comprobante"
              />
            </label>
          {/* Botón de Cerrar */}
          <button
            onClick={() => setMostrarModalTransferencia(false)}
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
            Enviar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default TransferenciaModal;