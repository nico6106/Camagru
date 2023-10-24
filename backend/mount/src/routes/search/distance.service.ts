
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	// Convertir les degrés en radians
	const radiansLat1 = (lat1 * Math.PI) / 180;
	const radiansLon1 = (lon1 * Math.PI) / 180;
	const radiansLat2 = (lat2 * Math.PI) / 180;
	const radiansLon2 = (lon2 * Math.PI) / 180;
  
	// Rayon de la Terre en mètres
	const earthRadius = 6371e3; // 6371 km
  
	// Différence de latitude et de longitude
	const deltaLat = radiansLat2 - radiansLat1;
	const deltaLon = radiansLon2 - radiansLon1;
  
	// Calcul de la distance en utilisant la formule haversine
	const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
				Math.cos(radiansLat1) * Math.cos(radiansLat2) *
				Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
	// Distance en mètres
	const distance = earthRadius * c;

	return distance;
}
  
  // Exemple d'utilisation
  const distance = haversineDistance(52.5200, 13.4050, 48.8566, 2.3522);
  