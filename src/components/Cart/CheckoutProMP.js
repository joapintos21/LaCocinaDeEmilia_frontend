import React from 'react';
import { Wallet } from '@mercadopago/sdk-react';

const CheckoutProButton = ({ preferenceId }) => {
	return (
		<div>
			<Wallet initialization={{ preferenceId: preferenceId }} />
		</div>
	);
};

export default CheckoutProButton;
