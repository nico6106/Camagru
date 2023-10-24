import { GPSCoordinates, TableUser, TableUsersName } from "../../database/data";
import { Database } from "../../database/db";
import { Request, Response } from "express";
import { getUserFromRequest } from "../auth/auth.service";
import { ErrorMsg, NotConnected, SuccessMsg } from "../../shared/errors";
import { haversineDistance } from "./distance.service";

type MatchingUsers = {
	user: TableUser;
	distance: number;
	nbCommonTags: number;
	commonTags: string[];
	normDist: number;
	normTags: number;
	normFame: number;
}

//return list of users: id, name, picture, distance, age, nb commons tags, fame rating
export async function browsingProfiles(db: Database, req: Request, res: Response) {
	const meUser: TableUser | null = await getUserFromRequest(db, req);
	if (!meUser)
		return res.status(200).json({ message: ErrorMsg, error: NotConnected });

	//get all users
	const allUsers: TableUser[] | null = await db.selectAllElemFromTable(TableUsersName);
	if (!allUsers)
		return res.status(200).json({ message: ErrorMsg, error: "servor error" });
	
	//filter current user from results
	const allUsersExceptMe: TableUser[] | null = allUsers.filter(elem => elem.id !== meUser.id);

	//filter by sexual preference
	const matchesBySexPref : TableUser[] = allUsersExceptMe.filter(elem => 
		meUser.preference === 'bisexual' || meUser.preference === elem.gender
		);

	console.log('nb match='+matchesBySexPref.length)
	// matchesBySexPref.forEach((elem, index) => {console.log(index+'='+elem.username+'('+elem.id+')')})
	
	const usersMatching: MatchingUsers[] = [];

	const coordCurrUser: GPSCoordinates = {
		latitude: meUser.position.latitude ? meUser.position.latitude : 0,
		longitude: meUser.position.longitude ? meUser.position.longitude : 0,
	}

	for (const elem of matchesBySexPref) {
		//compute nb of common tags
		const commonTags: string[] = computeCommonTags(meUser.interests, elem.interests);

		//compute distance
		const coordUser1: GPSCoordinates = {
			latitude: elem.position.latitude ? elem.position.latitude : 0,
			longitude: elem.position.longitude ? elem.position.longitude : 0,
		}
		const distance: number = haversineDistance(coordCurrUser.latitude, coordCurrUser.longitude, coordUser1.latitude, coordUser1.longitude);
		
		console.log('comparison with username='+elem.username+'('+elem.id+') : distance='+distance+', commonTags='+commonTags);
		//normalize distance
		
		//normalize tags
		//normalize fame rating
		//create obj and push it to list
	}


	//compute distance from other users and 
	return res.status(200).json({ message: SuccessMsg });
}

function computeCommonTags(tagsUser1: string[], tagsUser2: string[]): string[] {
	const commonTags: string[] = [];
	return commonTags;
}