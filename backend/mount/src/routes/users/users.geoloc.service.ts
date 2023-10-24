import { TableUser, TableUsersName } from "../../database/data";
import { Database } from "../../database/db";
import { Request, Response } from "express";
import { ErrorMsg, SuccessMsg } from "../../shared/errors";
import { getUserFromRequest } from "../auth/auth.service";
import IPinfoWrapper, { ApiLimitError, IPinfo } from "node-ipinfo";

type TPosition = {
	longitude: number;
	latitude: number;
}
export async function geolocUser(db: Database, req: Request, res: Response) {
	const { valid, latitude, longitude } = req.body;

	//recuperer USER
	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: ErrorMsg, error: "not connected", user: null });


	//verif si user force sa position via settings
	if (user.force_position === true) return res.status(200).json({ message: SuccessMsg }); 

	if (valid) {
		//sauvegarder geoloc user
		sauvGeoloc(db, user.id, longitude, latitude); 
	}
	else {
		//chercher geoloc avec IP
		const ipinfoWrapper = new IPinfoWrapper(`${process.env.IPINFO_TOKEN}`);

		let userIp = req.ip;
		if (userIp.match('::fff'))
			userIp = await getMyIp();

		ipinfoWrapper.lookupIp(userIp).then((response: IPinfo) => {
			console.log(response);
			if (response.loc) {
				const coordinates: string[] = response.loc.split(',');
				sauvGeoloc(db, user.id, coordinates[1], coordinates[0]); 
			}
		})
		.catch((error) => {
			// console.log(error);
			sauvGeoloc(db, user.id, '2.3488', '48.8534'); 
			if (error instanceof ApiLimitError) {
				// handle api limit exceed error
			} else {
				// handle other errors
			}
		});

	}
	return res.status(200).json({ message: SuccessMsg });
}

async function getMyIp() {
	const axios = require('axios');
	const userIp = '62.210.34.250';

	try {
		const response = await axios.get(
			`https://api.ipify.org/?format=json`,
			{
				withCredentials: true,
			},
		);
		console.log(response.data);
		if (response.data.ip)
			return response.data.ip
		return userIp;
	} catch (error) {
		//to handle ?
		return userIp;
	}
}

export async function sauvGeoloc(db: Database, userId: number, longitude: string, latitude: string ) {
	const newLongitude: number = parseFloat(longitude);
	const newLatitude: number = parseFloat(latitude);
	const position: TPosition = {
		longitude: newLongitude,
		latitude: newLatitude,
	}
	console.log(position)
	await db.AmendElemsFromTable(
		TableUsersName,
		'id',
		userId,
		['position'],
		[position],
	);
}