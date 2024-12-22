import React from 'react';
import Header from 'components/headers/light.js';
import { Container, ContentWithPaddingXl } from 'components/misc/Layouts';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import AnimationRevealPage from 'helpers/AnimationRevealPage';
import tw from 'twin.macro';
import PedidosPage from 'components/cards/Pedidos';

const PaginaPedidos = () => {
	return (
		<AnimationRevealPage>
			<Header />
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
