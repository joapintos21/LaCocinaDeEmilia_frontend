import React, { useState } from 'react';
import { Autocomplete, GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
	width: '100%',
	height: '500px',
};

const center = {
	lat: -34.8943348,
	lng: -56.1676025,
};

// Tu GeoJSON
const geoJsonData = {
	type: 'FeatureCollection',
	name: 'Envios',
	crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
	features: [
		{
			type: 'Feature',
			properties: { Name: 'Envío gratis a partir de $1900 en compra', description: 'sino $180' },
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[-56.1888482, -34.896676],
						[-56.1926933, -34.8976615],
						[-56.1946847, -34.89738],
						[-56.2152841, -34.9062847],
						[-56.2139437, -34.9093516],
						[-56.2120023, -34.9119962],
						[-56.2008237, -34.9111261],
						[-56.1863618, -34.9167046],
						[-56.1728871, -34.9151908],
						[-56.1698817, -34.9238107],
						[-56.1613822, -34.9290524],
						[-56.1240208, -34.9039797],
						[-56.1240975, -34.901331],
						[-56.1224148, -34.8997734],
						[-56.1392378, -34.8862565],
						[-56.1582921, -34.8918186],
						[-56.1645579, -34.8920649],
						[-56.1669784, -34.8932123],
						[-56.1790966, -34.8944389],
						[-56.1826677, -34.8956771],
						[-56.1858956, -34.8968449],
						[-56.1888482, -34.896676],
					],
				],
			},
		},
		{
			type: 'Feature',
			properties: { Name: 'Envío $200', description: null },
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[-56.1946847, -34.89738],
						[-56.1926933, -34.8976615],
						[-56.1888482, -34.896676],
						[-56.1858956, -34.8968449],
						[-56.1790966, -34.8944389],
						[-56.1669784, -34.8932123],
						[-56.1645579, -34.8920649],
						[-56.1582921, -34.8918186],
						[-56.1392378, -34.8862565],
						[-56.1622151, -34.8676463],
						[-56.2102588, -34.8753604],
						[-56.199209, -34.8834893],
						[-56.1946847, -34.89738],
					],
				],
			},
		},
		{
			type: 'Feature',
			properties: { Name: 'Envío $200', description: null },
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[-56.1622151, -34.8676463],
						[-56.1224148, -34.8997734],
						[-56.1009584, -34.8974976],
						[-56.0913454, -34.8951041],
						[-56.1073099, -34.8710243],
						[-56.1268793, -34.8571506],
						[-56.1449895, -34.8598269],
						[-56.1622151, -34.8676463],
					],
				],
			},
		},
		{
			type: 'Feature',
			properties: { Name: 'LA COCINA DE EMILIA', description: null },
			geometry: { type: 'Point', coordinates: [-56.158534, -34.912695] },
		},
		{
			type: 'Feature',
			properties: { Name: 'Envío $250', description: null },
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[-56.1268793, -34.8571506],
						[-56.1073099, -34.8710243],
						[-56.0913454, -34.8951041],
						[-56.065881, -34.8996722],
						[-56.0555813, -34.8917876],
						[-56.0433279, -34.8856452],
						[-56.0356141, -34.8820631],
						[-56.0298965, -34.8785863],
						[-56.0600445, -34.866721],
						[-56.1262486, -34.8447875],
						[-56.1698226, -34.8483629],
						[-56.2142693, -34.8577586],
						[-56.2235317, -34.8726212],
						[-56.2157607, -34.8732693],
						[-56.212154, -34.8742359],
						[-56.2102588, -34.8753604],
						[-56.1622151, -34.8676463],
						[-56.1449895, -34.8598269],
						[-56.1268793, -34.8571506],
					],
				],
			},
		},
		{
			type: 'Feature',
			properties: { Name: 'Envío $290', description: null },
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[-56.0647557, -34.845327],
						[-56.0790894, -34.8604704],
						[-56.0600445, -34.866721],
						[-56.0539807, -34.8690731],
						[-56.0298965, -34.8785863],
						[-55.997992, -34.8613606],
						[-55.9887955, -34.8556811],
						[-56.0015648, -34.8489721],
						[-56.0146759, -34.8427568],
						[-56.0299106, -34.8476529],
						[-56.0647557, -34.845327],
					],
				],
			},
		},
		{
			type: 'Feature',
			properties: { Name: 'Envío $290', description: null },
			geometry: {
				type: 'Polygon',
				coordinates: [
					[
						[-56.2142693, -34.8577586],
						[-56.2370812, -34.8715451],
						[-56.2645335, -34.8763126],
						[-56.2633319, -34.8883526],
						[-56.253333, -34.8954986],
						[-56.2450499, -34.8949],
						[-56.2446208, -34.8849028],
						[-56.2363811, -34.8789883],
						[-56.2335012, -34.88042],
						[-56.2291622, -34.8788239],
						[-56.2237463, -34.8728148],
						[-56.2142693, -34.8577586],
					],
				],
			},
		},
	],
};

const MapComponent = ({ onDireccionSeleccionada, setOpcional }) => {
	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: 'AIzaSyDz0f2_Bz_B-86V7SvOL0hX5AoFR3fe5cM',
		libraries: ['places'],
	});

	const [map, setMap] = useState(null);
	const [autocomplete, setAutocomplete] = useState(null);
	const [markerPosition, setMarkerPosition] = useState(null);

	const onLoad = (mapInstance) => {
		setMap(mapInstance);

		// Cargar GeoJSON al mapa
		mapInstance.data.addGeoJson(geoJsonData);

		// Aplicar estilos a los polígonos
		mapInstance.data.setStyle((feature) => {
			const name = feature.getProperty('Name'); // Obtener el nombre de la zona
			let fillColor;

			switch (name) {
				case 'Envío gratis a partir de $1900 en compra':
					fillColor = '#FF5733'; // Color para Zona 1
					break;
				case 'Envío $200':
					fillColor = '#33FF57'; // Color para Zona 2
					break;
				case 'Envío $250':
					fillColor = '#2196F3'; // Color para Zona 2
					break;
				default:
					fillColor = 'orange'; // Color por defecto
			}

			return {
				fillColor: fillColor,
				strokeColor: '#1976D2',
				strokeWeight: 2,
				fillOpacity: 0.5,
			};
		});

		// Manejar eventos en los polígonos
		mapInstance.data.addListener('click', (event) => {
			const name = event.feature.getProperty('Name');
			const description = event.feature.getProperty('description');
			alert(`Zona: ${name}\n${description}`);
		});
	};

	const onLoadAutocomplete = (autoC) => {
		setAutocomplete(autoC);
	};

	const onPlaceChanged = () => {
		if (autocomplete !== null) {
			const place = autocomplete.getPlace();
			const location = place.geometry.location;

			const nuevaDireccion = place.formatted_address.split(',')[0];
			const coordenadas = {
				lat: location.lat(),
				lng: location.lng(),
			};

			// Pasa la dirección y las coordenadas al callback
			onDireccionSeleccionada({ direccion: nuevaDireccion, coordenadas });

			console.log('Dirección:', nuevaDireccion);
			console.log('Coordenadas:', coordenadas);

			// Mueve el mapa al lugar seleccionado
			map.panTo(coordenadas);
			map.setZoom(16);

			// Coloca un marcador en el lugar seleccionado
			setMarkerPosition(coordenadas);
		} else {
			console.log('Autocomplete is not loaded yet!');
		}
	};

	return isLoaded ? (
		<>
			<Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
				<input
					type="text"
					placeholder="Ingresar calle y numero de puerta"
					style={{
						width: '100%',
						padding: '10px',
						marginBottom: '10px',
						border: '1px solid #ccc',
						borderRadius: '4px',
					}}
				/>
			</Autocomplete>
			<input
				type="text"
				placeholder="(Opcional) Ingresar numero de apartameto, piso."
				onChange={(e) => setOpcional(e.target.value)}
				style={{
					width: '100%',
					padding: '10px',
					marginBottom: '10px',
					border: '1px solid #ccc',
					borderRadius: '4px',
				}}
			/>
			<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} onLoad={onLoad}>
				{markerPosition && <Marker position={markerPosition} />}
			</GoogleMap>
		</>
	) : (
		<p>Cargando...</p>
	);
};

export default MapComponent;
