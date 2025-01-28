import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from 'components/headers/light.js';
import { Container, ContentWithPaddingXl } from 'components/misc/Layouts';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import AnimationRevealPage from 'helpers/AnimationRevealPage';
import tw from 'twin.macro';
import Pack from 'components/cards/Pack';

const PaginaPack = () => {
	const { id } = useParams();
	const packs = useSelector((state) => state.packs);
	const [pack, setPack] = useState(null);

	useEffect(() => {
		const selectedPack = packs.find((p) => p.id === parseInt(id, 10));
		setPack(selectedPack);
	}, [id, packs]);

	if (!pack) {
		return <p>Cargando pack...</p>;
	}

	return (
		<AnimationRevealPage>
			<Header />
			<Container>
				<ContentWithPaddingXl>
					<Pack pack={pack} />
				</ContentWithPaddingXl>
			</Container>
			<Footer />
		</AnimationRevealPage>
	);
};

export default PaginaPack;
