import axios from "axios";
import { useEffect } from "react";

function AskGeolocalisation() {
	async function backendGeo(valid: boolean, latitude?: number, longitude?: number) {
		
		try {
			const response = await axios.post(
                `http://${process.env.REACT_APP_SERVER_ADDRESS}:3333/users/geoloc`,
                {
                    valid: valid,
					latitude: latitude,
					longitude: longitude,
                },
                {
                    withCredentials: true,
                },
            );
			console.log(response);
			// info
		} catch {}
	}

	useEffect(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				function (position) {
					// Vous avez accès aux données de géolocalisation dans l'objet position.
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;

					backendGeo(true, latitude, longitude);
				},
				function (error) {
					// Gestion des erreurs en cas de refus ou d'erreur de géolocalisation.
					backendGeo(false);
				},
			);
		} else {
			backendGeo(false);
		}
	}, []);

    return <></>;
}

export default AskGeolocalisation;
