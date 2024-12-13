import React from 'react';
import tw from 'twin.macro';
import { css } from 'styled-components/macro'; //eslint-disable-line
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import Header from 'components/headers/light.js';
import TabGrid from 'components/cards/TabCardGrid.js';
import Footer from 'components/footers/FiveColumnWithInputForm.js';

export default () => {
	const HighlightedText = tw.span`bg-[#99cdb6] text-gray-100 px-4 transform -skew-x-12 inline-block`;

	return (
		<AnimationRevealPage>
			<Header />
			<TabGrid
				heading={
					<>
						Nuestros <HighlightedText> productos.</HighlightedText>
					</>
				}
			/>
			<Footer />
		</AnimationRevealPage>
	);
};
