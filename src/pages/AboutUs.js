import React from 'react';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';
import tw from 'twin.macro';
import Header from 'components/headers/light.js';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import MainFeature1 from 'components/features/Nosotros.js';
import Features from 'components/features/ThreeColSimple.js';
import TeamCardGrid from 'components/cards/ProfileThreeColGrid.js';

import SupportIconImage from 'images/support-icon.svg';
import ShieldIconImage from 'images/shield-icon.svg';
import CustomerLoveIconImage from 'images/simple-icon.svg';

const Subheading = tw.span`uppercase tracking-wider text-sm`;
export default () => {
	return (
		<AnimationRevealPage>
			<MainFeature1
				heading="Acerca de nosotros."
				buttonRounded={false}
				primaryButtonText="Contact Us"
				imageSrc="https://images.unsplash.com/3/doctype-hi-res.jpg?ixlib=rb-1.2.1&auto=format&fit=crop&w=768&q=80"
				textOnLeft={false}
			/>
			<Footer />
		</AnimationRevealPage>
	);
};
