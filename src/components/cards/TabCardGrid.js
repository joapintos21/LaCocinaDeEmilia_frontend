import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import tw from 'twin.macro';
import styled from 'styled-components';
import { css } from 'styled-components/macro'; //eslint-disable-line
import { Container, ContentWithPaddingXl } from 'components/misc/Layouts.js';
import { SectionHeading } from 'components/misc/Headings.js';
import { PrimaryButton as PrimaryButtonBase } from 'components/misc/Buttons.js';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { obtenerProductos } from 'scripts/obtenerProductosCategoria';
import { buscarProducto } from 'scripts/buscarProducto';

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const Header = tw(SectionHeading)``;
const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;
const SearchContainer = tw.div`flex justify-end items-center mt-4 mb-4`;
const SearchInput = styled.input`
	${tw`border border-secondary-300 rounded-full px-4 py-2 w-64`}
	transition: all 0.3s ease-in-out;
	&:focus {
		${tw`border-primary-500 shadow-lg outline-none`}
	}
`;

const TabControl = styled.div`
	${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
	&:hover {
		${tw`bg-gray-300 text-gray-700`}
	}
	${(props) => props.active && tw`bg-primary-500! text-gray-100!`}
`;

const TabContent = tw(motion.div)`mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12`;
const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
const Card = tw(motion.a)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
	${(props) => css`
		background-image: url('${props.imageSrc}');
	`}
	${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;

const CardHoverOverlay = styled(motion.div)`
	background-color: rgba(255, 255, 255, 0.5);
	${tw`absolute inset-0 flex justify-center items-center`}
`;
const CardButton = tw(PrimaryButtonBase)`text-sm`;
const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-primary-500`;
const CardPrice = tw.p`mt-4 text-xl font-bold`;

export default () => {
	const [products, setProducts] = useState([]);
	const [packs, setPacks] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [searchText, setSearchText] = useState('');
	const dispatch = useDispatch();
	const productosRedux = useSelector((state) => state.productos);
	const packsRedux = useSelector((state) => state.packs);
	const categoriasRedux = useSelector((state) => state.categorias);
	const [activeTab, setActiveTab] = useState('Todos');
	const [noResults, setNoResults] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	// Manejar el parámetro "categoria" en la URL
	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const categoriaParam = searchParams.get('categoria');

		if (categoriaParam) {
			const matchingCategory = categoriasRedux.find(
				(category) => category.titulo.toLowerCase() === categoriaParam.toLowerCase(),
			);
			if (matchingCategory) {
				setActiveTab(matchingCategory.titulo);
			} else if (categoriaParam.toLowerCase() === 'packs') {
				setActiveTab('Packs');
			} else {
				setActiveTab('Todos');
			}
		} else {
			setActiveTab('Todos');
		}
	}, [location, categoriasRedux]);

	// Cargar productos y packs desde Redux
	useEffect(() => {
		const fetchProductos = async () => {
			await obtenerProductos(dispatch);
		};
		fetchProductos();
	}, [dispatch]);

	useEffect(() => {
		if (productosRedux && productosRedux.length > 0) {
			const transformedProducts = productosRedux
				.filter((producto) => producto.visible)
				.map((producto) => ({
					id: producto.id,
					imageSrc:
						producto.imageUrl ||
						'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
					title: producto.descripcion || 'Sin nombre',
					price: producto.precio || '$0.00',
					category: producto.categoria.titulo || 'Otros',
					url: `/producto/${producto.id}`,
				}));
			setProducts(transformedProducts);
		}
	
		if (packsRedux && packsRedux.length > 0) {
			const transformedPacks = packsRedux.map((pack) => ({
				id: pack.id,
				imageSrc: 'https://via.placeholder.com/150',
				title: pack.nombre || 'Pack sin nombre',
				price: pack.precio || '$0.00',
				category: 'Packs',
				url: `/pack/${pack.id}`,
			}));
			setPacks(transformedPacks);
		}
	}, [productosRedux, packsRedux]);

	// Combinar productos y packs en las tabs
	useEffect(() => {
		const combinedItems = [...products, ...packs];
		setFilteredProducts(combinedItems);
	}, [products, packs]);

	const tabs = {
		Todos: filteredProducts.length > 0 ? filteredProducts : products,
		Packs: packs,
		...categoriasRedux.reduce((acc, categoria) => {
			acc[categoria.titulo] = filteredProducts.filter((product) => product.category === categoria.titulo);
			return acc;
		}, {}),
	};

	// Manejo de búsqueda
	const handleSearch = async () => {
		if (searchText.trim() === '') {
			setFilteredProducts(products); // Restablece todos los productos si el campo de búsqueda está vacío
			setActiveTab('Todos');
			setNoResults(false);
		} else {
			try {
				const resultados = await buscarProducto(searchText);
				const transformedResults = resultados.map((producto) => ({
					id: producto.id,
					imageSrc:
						producto.imageUrl ||
						'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80',
					title: producto.descripcion || 'Sin nombre',
					price: producto.precio || '$0.00',
					category: producto.categoria.titulo || 'Otros',
					url: '#',
				}));
				if (transformedResults.length === 0) {
					setNoResults(true);
					setActiveTab('');
				} else {
					setNoResults(false);
					setActiveTab('Todos');
				}
				setFilteredProducts(transformedResults);
			} catch (error) {
				console.error('Error en la búsqueda:', error);
			}
		}
	};

	return (
		<Container>
			<ContentWithPaddingXl>
				<HeaderRow>
					<Header>Nuestros Productos</Header>
					<SearchContainer>
						<SearchInput
							type="text"
							placeholder="Buscar productos..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
						/>
					</SearchContainer>
				</HeaderRow>
				<HeaderRow>
					<TabsControl>
						{Object.keys(tabs).map((tabName, index) => (
							<TabControl
								key={index}
								active={activeTab === tabName}
								onClick={() => setActiveTab(tabName)}
							>
								{tabName}
							</TabControl>
						))}
					</TabsControl>
				</HeaderRow>

				{Object.keys(tabs).map((tabKey, index) => (
					<TabContent
						key={index}
						variants={{
							current: {
								opacity: 1,
								scale: 1,
								display: 'flex',
							},
							hidden: {
								opacity: 0,
								scale: 0.8,
								display: 'none',
							},
						}}
						transition={{ duration: 0.4 }}
						initial={activeTab === tabKey ? 'current' : 'hidden'}
						animate={activeTab === tabKey ? 'current' : 'hidden'}
					>
						{tabs[tabKey].map((card, index) => (
							<CardContainer key={index}>
								<Card
									className="group"
									href={card.url}
									initial="rest"
									whileHover="hover"
									animate="rest"
								>
									<CardImageContainer imageSrc={card.imageSrc}>
										<CardHoverOverlay
											variants={{
												hover: {
													opacity: 1,
													height: 'auto',
												},
												rest: {
													opacity: 0,
													height: 0,
												},
											}}
											transition={{ duration: 0.3 }}
										>
											<CardButton onClick={() => navigate(card.url)}>Ver más</CardButton>
										</CardHoverOverlay>
									</CardImageContainer>
									<CardText>
										<CardTitle>{card.title}</CardTitle>
										<CardPrice>${card.price}</CardPrice>
									</CardText>
								</Card>
							</CardContainer>
						))}
					</TabContent>
				))}
				{noResults && <p>No se encontraron resultados</p>}
			</ContentWithPaddingXl>
		</Container>
	);
};
