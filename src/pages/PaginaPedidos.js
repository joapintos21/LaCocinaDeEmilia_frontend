import React from 'react';
import { Container, ContentWithPaddingXl } from 'components/misc/Layouts';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import AnimationRevealPage from 'helpers/AnimationRevealPage';
import PedidosPage from 'components/cards/Pedidos';

const PaginaPedidos = () => {
	return (
		<AnimationRevealPage>
			<Container>
				<ContentWithPaddingXl>
					<PedidosPage />
				</ContentWithPaddingXl>
			</Container>
			<Footer />
		</AnimationRevealPage>
	);
};

export default PaginaPedidos;
