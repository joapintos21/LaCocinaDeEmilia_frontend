import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const PaymentStatus = () => {
  const [status, setStatus] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const paymentStatus = searchParams.get('status'); // Captura el parámetro "status" de la URL
    setStatus(paymentStatus);
  }, [searchParams]);

  return (
    <div>
      {status === 'pago_aceptado' && <h1>¡Pago exitoso!</h1>}
      {status === 'pago_pendiente' && <h1>Pago pendiente. Estamos procesándolo.</h1>}
      {status === 'pago_rechazado' && <h1>Pago fallido. Intenta nuevamente.</h1>}
    </div>
  );
};

export default PaymentStatus;