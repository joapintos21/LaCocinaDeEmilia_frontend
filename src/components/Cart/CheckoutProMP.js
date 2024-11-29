
import React, { useEffect } from 'react';
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

const CheckoutProButton = ({preferenceId}) => {
    useEffect(() => {
      initMercadoPago('APP_USR-28f591e9-5e20-4be6-b155-a96076aaf777', { locale: 'es-UY' });
    }, []);

    return (
      <div>
        <Wallet initialization={{preferenceId: preferenceId}} />
      </div>
    );
};

export default CheckoutProButton;