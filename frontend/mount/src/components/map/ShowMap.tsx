import React from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { TGeoJSON } from '../../shared/map';
import axios from 'axios';


function ShowMap() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState(2.339868);
    const [lat, setLat] = useState(48.908664);
    const [zoom, setZoom] = useState(9);
    const [dataMap, setDataMap] = useState<TGeoJSON | null>(null);

	useEffect(() => {
		if (process.env.REACT_APP_MAPBOX_API)
			mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API;
		else
			return ;
        searchInitBackend();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function searchInitBackend() {
        try {
            const response = await axios.get(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/search/map/`,
                {
                    withCredentials: true,
                },
            );
            console.log(response.data);
            if (response.data && response.data.data_map) {
                setDataMap(response.data.data_map);
            }
            if (response.data && response.data.center_map) {
                setLng(response.data.center_map.longitude);
                setLat(response.data.center_map.latitude);
            }
            return true;
        } catch (error) {
            // setRetour(null);
        }
    }


    useEffect(() => {
        if (!map.current && dataMap) {
            // Initialize map only once
            map.current = new mapboxgl.Map({
                container: mapContainer.current!,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: zoom,
            });

            for (const feature of dataMap.features) {
                // Create a HTML element for each feature
                const el = document.createElement('div');
                el.className = 'marker';
                const link: string =
                    feature.properties.image !== ''
                        ? `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/image/${feature.properties.image}`
                        : '/logo-matcha-red.png';
                el.style.backgroundImage = `url('${link}')`;

                // Make a marker for each feature and add it to the map
                new mapboxgl.Marker(el)
                    .setLngLat(feature.geometry.coordinates)
                    .setPopup(
                        new mapboxgl.Popup({ offset: 25 }) // Add popups
                            .setHTML(
                                `<a href='/profile/${feature.properties.idUser}'><h3><b>${feature.properties.title}</b></h3><p>${feature.properties.description}</p></a>`,
                            ),
                    )
                    .addTo(map.current);
            }
        }
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataMap]);

    return (
        <>
            <style>
                {`
			.map-container {
				height: 600px;
				width: 100%;

				}
			
			.sidebar {
				background-color: rgba(35, 55, 75, 0.9);
				color: #fff;
				padding: 6px 12px;
				font-family: monospace;
				z-index: 1;
				position: absolute;
				top: 0;
				left: 0;
				margin: 12px;
				border-radius: 4px;
				}

			.marker {
				background-size: cover;
				width: 50px;
				height: 50px;
				border-radius: 50%;
				cursor: pointer;
				}
			.mapboxgl-popup {
				max-width: 200px;
				}
			.mapboxgl-popup-content {
				text-align: center;
				font-family: 'Open Sans', sans-serif;
				}
			`}
            </style>
            <div className="item-align-center">
                <div ref={mapContainer} className="map-container" />
            </div>
        </>
    );
}

export default ShowMap;
