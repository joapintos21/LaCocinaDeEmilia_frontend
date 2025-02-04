import React from 'react';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import Carrito from 'components/Cart/CartPage';
import { Container, ContentWithPaddingXl } from 'components/misc/Layouts';

export default () => {
	return (
		<AnimationRevealPage>
			<Container>
				<ContentWithPaddingXl>
					<Carrito />
				</ContentWithPaddingXl>
			</Container>
			<Footer />
		</AnimationRevealPage>
	);
};
