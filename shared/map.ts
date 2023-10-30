export type PropertiesFeature = {
    title: string;
    description: string;
	image: string;
	idUser: number;
};

export type GeometryFeature = {
    type: string;
    coordinates: [number, number];
};

export type FeatureType = {
    type: string;
    geometry: GeometryFeature;
    properties: PropertiesFeature;
};

export type TGeoJSON = {
    type: string;
    features: FeatureType[];
};