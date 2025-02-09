import React, { useEffect, useState } from 'react';
import Producto from 'components/cards/Producto';
import { useParams } from 'react-router-dom';
import { Container, ContentWithPaddingXl } from 'components/misc/Layouts';
import Footer from 'components/footers/FiveColumnWithInputForm.js';
import AnimationRevealPage from 'helpers/AnimationRevealPage';
import { obtenerProducto } from 'scripts/obtenerProducto';
import { toast } from 'react-toastify';

const PaginaProducto = () => {
	const { id } = useParams();
	const [producto, setProducto] = useState(null);

	useEffect(() => {
		obtenerProducto(id)
			.then((data) => {
				setProducto(data);
			})
			.catch((e) => {
				toast.error(e.message);
			});
	}, [id]);

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
