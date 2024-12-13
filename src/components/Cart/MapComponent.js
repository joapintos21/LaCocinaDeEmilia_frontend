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
						[-56.2163141, -34.907798],
						[-56.2120023, -34.9119962],
						[-56.2008237, -34.9111261],
						[-56.1863618, -34.9167046],
						[-56.1728871, -34.9151908],
						[-56.1698817, -34.9238107],
						[-56.1613822, -34.9290524],
						[-56.1224148, -34.8997734],
						[-56.1392378, -34.8862565],
						[-56.1582921, -34.8918186],
						[-56.1645579, -34.8920649],
						[-56.1669784, -34.8932123],
						[-56.1790966, -34.8944389],
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
						[-56.1858956, -34.8968449],
						[-56.1790966, -34.8944389],
						[-56.1663585, -34.892807],
						[-56.1645579, -34.8920649],
						[-56.1582921, -34.8918186],
						[-56.1392378, -34.8862565],
						[-56.1622151, -34.8676463],
						[-56.2095078, -34.8752196],
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
						[-56.0308621, -34.877847],
						[-56.0600445, -34.866721],
						[-56.125562, -34.8463372],
						[-56.1595229, -34.8530117],
						[-56.2142693, -34.8577586],
						[-56.2184677, -34.8695756],
						[-56.2083756, -34.8739348],
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
						[-56.0463021, -34.8472993],
						[-56.0612366, -34.8661749],
						[-56.0308621, -34.877847],
						[-56.0147164, -34.8706818],
						[-56.0463021, -34.8472993],
					],
				],
			},
		},
	],
};

const MapComponent = ({ onDireccionSeleccionada }) => {
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

			const nuevaDireccion = place.formatted_address;
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

	return isLoaded ?
			<>
				<Autocomplete onLoad={onLoadAutocomplete} onPlaceChanged={onPlaceChanged}>
					<input
						type="text"
						placeholder="Buscar dirección"
						style={{
							width: '100%',
							padding: '10px',
							marginBottom: '10px',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
					/>
				</Autocomplete>
				<GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12} onLoad={onLoad}>
					{markerPosition && <Marker position={markerPosition} />}
				</GoogleMap>
			</>
		:	<p>Cargando...</p>;
};

export default MapComponent;
