import { TableUser, TableUsersName } from "../../database/data";
import { Database } from "../../database/db"
import { Request, Response } from "express";
import { PayloadJWTType } from "../auth/types";
import { getUserFromRequest, verifyJWT } from "../auth/auth.service";
import { AvailableTags } from "../../data/data-tags";


export async function getMe(db: Database, req: Request, res: Response) {
	
	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: "error", error: "not connected", user: null });
	return res.status(200).json({ message: "success", user: user, tags: AvailableTags });
}

export async function updateSettings(db: Database, req: Request, res: Response) {
	const { email, lastname, firstname, datebirth, gender, preference, biography, tags} = req.body;
    console.log('update settings');

    //recuperer USER
    const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: "error", error: "not connected", user: null });

    console.log(user);

	//amend user
	db.AmendElemsFromTable(
        TableUsersName,
        'id',
        user.id,
		['email', 'last_name', 'first_name', 'date_birth', 'gender', 'preference', 'interests', 'biography'],
        [email, lastname, firstname, datebirth, gender, preference, tags, biography],
    );

    return res.status(200).json({ message: 'success' });
}

export async function uploadImg(db: Database, req: Request, res: Response) {
	// console.log(req.file);
	console.log('done?')
	return res.status(200).json({ message: 'success' });
	
}