import { GPSCoordinates, TableUser, TableUsersName } from '../../database/data';
import { Database } from '../../database/db';
import { Request, Response } from 'express';
import { getUserFromRequest } from '../auth/auth.service';
import { ErrorMsg, NotConnected, SuccessMsg } from '../../shared/errors';
import { MatchingUsers, computeRawDataForAnalysis, createResponse, createResponseGlobalData, normalizeResults } from './search.service';
import { MatchingGlobalData, MatchingResponse } from '../../shared/search';
import { FeatureType, GeometryFeature, PropertiesFeature, TGeoJSON } from '../../shared/map';
import { computeAgeUser } from '../users/users.service';

export async function dataMap(db: Database, req: Request, res: Response) {
	const meUser: TableUser | null = await getUserFromRequest(db, req);
    if (!meUser)
        return res.status(200).json({ message: ErrorMsg, error: NotConnected });

    //get all users
    const allUsers: TableUser[] | null = await db.selectAllElemFromTable(
        TableUsersName,
    );
    if (!allUsers)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'servor error' });

    //filter current user from results
    const allUsersExceptMe: TableUser[] | null = allUsers.filter(
        (elem) => elem.id !== meUser.id,
    );

	//filter blocked users
	const allUsersExceptBlocked: TableUser[] = allUsersExceptMe.filter(elem => !meUser.blocked_user.includes(elem.id));

    //filter by sexual preference
    const matchesBySexPref: TableUser[] = allUsersExceptBlocked.filter(
        (elem) =>
            meUser.preference === 'bisexual' ||
            meUser.preference === elem.gender,
    );

    const allDistances: number[] = [];
    const allNbTags: number[] = [];
    const allFame: number[] = [];

    const coordCurrUser: GPSCoordinates = {
        latitude: meUser.position.latitude ? meUser.position.latitude : 0,
        longitude: meUser.position.longitude ? meUser.position.longitude : 0,
    };

    //compute raw data for analysis
    const usersMatching: MatchingUsers[] = computeRawDataForAnalysis(
        meUser,
        matchesBySexPref,
        coordCurrUser,
        allDistances,
        allNbTags,
        allFame,
    );

    //normalize
    normalizeResults(usersMatching, allDistances, allNbTags, allFame);

    const response: MatchingResponse[] = createResponse(usersMatching);

	//data for map
	
	//show max 100 profile
	//to do

	//generate data according to type:
	const features: FeatureType[] = [];

	for (const elem of usersMatching) {
		const geometry: GeometryFeature = {
			type: 'Point',
			coordinates: [elem.user.position.longitude, elem.user.position.latitude],
		}
		const property: PropertiesFeature = {
			title: `${elem.user.first_name}`,
			description: `${computeAgeUser(elem.user.date_birth)} years old`,
			image: elem.user.profile_picture,
			idUser: elem.user.id,
		}
		const feature: FeatureType = {
			type: 'Feature',
			geometry: geometry,
			properties: property,
		}
		features.push(feature);
	}

	const data: TGeoJSON = {
		type: 'FeatureCollection',
		features: features,
	}

	return res
        .status(200)
        .json({
            message: SuccessMsg,
            data_map: data,
			center_map: coordCurrUser,
        });

}

// {
// 	type: 'Feature',
// 	geometry: {
// 		type: 'Point',
// 		coordinates: [-77.032, 38.913],
// 	},
// 	properties: {
// 		title: 'Mapbox',
// 		description: 'Washington, D.C.',
// 	},
// }