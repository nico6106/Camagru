import { TableUser, TableUsersName } from "../../database/data";
import { Database } from "../../database/db";
import { Request, Response } from "express";
import { ErrorMsg, SuccessMsg } from "../../shared/errors";
import { getUserFromRequest } from "../auth/auth.service";

export async function geolocUser(db: Database, req: Request, res: Response) {
	const { valid, latitude, longitude } = req.body;

	//recuperer USER
	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: ErrorMsg, error: "not connected", user: null });


	if (valid) {
		//sauvegarder geoloc user
		//amend user
		const position = {
			longitude: longitude,
			latitude: latitude,
		}
		console.log(position)
		await db.AmendElemsFromTable(
			TableUsersName,
			'id',
			user.id,
			['position'],
			[position],
		);
	}
	else {
		//chercher geoloc avec IP
		;
	}
	return res.status(200).json({ message: SuccessMsg });
}