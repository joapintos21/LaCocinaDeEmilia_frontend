import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import AnimationRevealPage from 'helpers/AnimationRevealPage.js';

import Features from 'components/features/ThreeColSimple.js';
import MainFeature from 'components/features/Recetarios';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import TabCategoryGrid from 'components/cards/TabCategoryGrid';
import { useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { obtenerIGMedia } from 'scripts/obtenerIGMedia';

export default () => {
	const Subheading = tw.span`tracking-wider text-sm font-medium`;
	const HighlightedText = tw.span`bg-[#99cdb6] text-gray-100 px-4 transform -skew-x-12 inline-block`;
	const Description = tw.span`inline-block mt-8`;
	const CarruselContainer = tw.div`container mx-auto mt-4 p-4`;
	const SwiperStyled = tw(Swiper)`
	w-10/12
	h-[300px] // Altura base
	sm:h-[400px] // Altura en pantallas medianas
	lg:h-[500px] // Altura en pantallas grandes`;
	const SlideContent = tw.div`flex w-full h-full`;
	const MediaColumn = tw.div`w-1/2 h-full flex items-center justify-end p-2`;
	const TextColumn = tw.div`w-1/2 h-full flex flex-col justify-center items-center pr-8 pl-2`;
	const MediaImage = tw.img`max-w-full max-h-full object-contain rounded-lg`;
	const MediaVideo = tw.video`max-w-full max-h-full object-contain rounded-lg`;
	const CaptionText = tw.div`text-lg font-medium text-gray-700`;
	const TimestampText = tw.div`mt-2 text-sm text-gray-500`;

	const imageCss = tw`rounded-4xl`;
	const [categories, setCategories] = useState([]);
	const categoriasRedux = useSelector((state) => state.categorias);
	const [media, setMedia] = useState([]);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchMedia = async () => {
			try {
				const data = await obtenerIGMedia();
				setMedia(data);
			} catch (err) {
				setError('No se pudo cargar el contenido. Intenta nuevamente más tarde.');
			}
		};

		fetchMedia();
	}, []);

	// Transforma las categorías al formato requerido para `TabCategoryGrid`
	useEffect(() => {
		if (categoriasRedux && categoriasRedux.length > 0) {
			const transformedCategories = categoriasRedux.map((categoria) => ({
				imageSrc:
					categoria.imageUrl ||
					'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80', // Usa una URL por defecto si no hay `imageUrl`
				title: categoria.titulo || 'Sin nombre',
				description: categoria.descripcion || 'Sin descripción',
				url: `/productos?categoria=${categoria.titulo}`,
			}));
			setCategories(transformedCategories);
		}
	}, [categoriasRedux]);

	return (
		<AnimationRevealPage>
			{error && <div className="text-red-500 text-center mt-4">{error}</div>}
			<CarruselContainer>
				<SwiperStyled
					modules={[Navigation, Pagination, Autoplay]}
					spaceBetween={30}
					slidesPerView={1}
					navigation
					pagination={{ clickable: true }}
					autoplay={{ delay: 8000 }}
				>
					{media.map(
						(item) =>
							item.media_type !== 'CAROUSEL_ALBUM' && (
								<SwiperSlide key={item.id}>
									<SlideContent>
										<MediaColumn>
											{item.media_type === 'IMAGE' && (
												<MediaImage src={item.media_url} alt="Instagram Media" />
											)}
											{item.media_type === 'VIDEO' && (
												<MediaVideo autoPlay muted loop>
													<source src={item.media_url} type="video/mp4" />
												</MediaVideo>
											)}
										</MediaColumn>
										<TextColumn>
											{item.caption && <CaptionText>{item.caption}</CaptionText>}
											{item.timestamp && (
												<TimestampText>
													{new Date(item.timestamp).toLocaleDateString('es-ES', {
														year: 'numeric',
														month: 'long',
														day: 'numeric',
													})}
												</TimestampText>
											)}
										</TextColumn>
									</SlideContent>
								</SwiperSlide>
							),
					)}
				</SwiperStyled>
			</CarruselContainer>
			<MainFeature
				heading={
					<>
						<wbr /> <HighlightedText>Recetarios.</HighlightedText>
					</>
				}
				description={
					<Description>
						Descubre el sabor de la inspiración. Entra en el mundo de la creatividad culinaria con nuestros
						recetarios cuidadosamente seleccionados.
						<br />
						<br />
						¡Explora, cocina y sorprende! Porque cada receta es una historia lista para ser saboreada.
					</Description>
				}
				buttonRounded={false}
				textOnLeft={false}
				primaryButtonText="Ver recetarios."
				imageSrc={
					'https://images.unsplash.com/photo-1460306855393-0410f61241c7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80'
				}
				imageCss={imageCss}
				imageDecoratorBlob={true}
				imageDecoratorBlobCss={tw`left-1/2 -translate-x-1/2 md:w-32 md:h-32 opacity-25`}
			/>
			{/* TabGrid Component also accepts a tabs prop to customize the tabs and its content directly. Please open the TabGrid component file to see the structure of the tabs props.*/}

			<TabCategoryGrid
				heading={
					<>
						Nuestras <HighlightedText>mejores categorías.</HighlightedText>
					</>
				}
				categories={categories}
			/>
			<Footer />
		</AnimationRevealPage>
	);
};
