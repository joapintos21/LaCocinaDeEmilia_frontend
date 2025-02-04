import React, { useEffect, useState } from 'react';
import Producto from 'components/cards/Producto';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, ContentWithPaddingXl } from 'components/misc/Layouts';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import AnimationRevealPage from 'helpers/AnimationRevealPage';

const PaginaProducto = () => {
	const { id } = useParams();
	const productos = useSelector((state) => state.productos);
	const [producto, setProducto] = useState(null);

	useEffect(() => {
		const selectedProducto = productos.find((prod) => prod.id === parseInt(id, 10));
		setProducto(selectedProducto);
	}, [id, productos]);

	if (!producto) {
		return <p>Cargando producto...</p>;
	}

	return (
		<AnimationRevealPage>
			<Container>
				<ContentWithPaddingXl>
					<Producto producto={producto} />
				</ContentWithPaddingXl>
			</Container>
			<Footer />
		</AnimationRevealPage>
	);
};

export default PaginaProducto;
