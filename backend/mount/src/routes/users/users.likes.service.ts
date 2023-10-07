import { TableUser, TableUsersName } from "../../database/data";
import { Database } from "../../database/db";
import { Request, Response } from "express";
import { getUserFromRequest } from "../auth/auth.service";
import { ErrorMsg, NotConnected, ProfileAlreadyLiked, ProfileNotLiked, SuccessMsg, UnknownUsername } from "../../shared/errors";
import { UserLinkFromDB, addElemToJSONData } from "./users.service";
import { computeFame } from "./users.fame.service";

export async function likeUser(db: Database, req: Request, res: Response) {
	const { id } = req.params;
	const idNb = parseInt(id);
	const meUser: TableUser | null = await getUserFromRequest(db, req);
	const now = Date.now();
	if (!meUser)
		return res.status(200).json({ message: ErrorMsg, error: NotConnected });

	const users: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'id',
        idNb,
    );
    if (!(users && users.length === 1)) 
		return res.status(200).json({ message: ErrorMsg, error: UnknownUsername });

	if (meUser.id !== users[0].id) {
		console.log(meUser.id+' likes '+users[0].id);
		if (checkAlreadyLiked(meUser.likes, users[0].id))
			return res.status(200).json({ message: ErrorMsg, error: ProfileAlreadyLiked });

		await addElemToJSONData(db, meUser.likes, {id: users[0].id, date: now}, meUser.id, 'likes');
		await addElemToJSONData(db, users[0].liked_by, {id: meUser.id, date: now}, users[0].id, 'liked_by');

		//compute fame evol
		await computeFame(db, 'liked', users[0]);
	}
	return res.status(200).json({ message: SuccessMsg });
}

export function checkAlreadyLiked(data: UserLinkFromDB[], userId: number): boolean {
	if (data.length === 0)
		return false;
	for (let i = 0; i < data.length; i++) {
		if (data[i].id === userId) 
			return true;
	}
	return false;
}

export async function unlikeUser(db: Database, req: Request, res: Response) {
	const { id } = req.params;
	const idNb = parseInt(id);
	const meUser: TableUser | null = await getUserFromRequest(db, req);
	const now = Date.now();
	if (!meUser)
		return res.status(200).json({ message: ErrorMsg, error: NotConnected });

	const users: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'id',
        idNb,
    );
    if (!(users && users.length === 1)) 
		return res.status(200).json({ message: ErrorMsg, error: UnknownUsername });

	if (meUser.id !== users[0].id) {
		console.log(meUser.id+' unlikes '+users[0].id);

		if (checkAlreadyLiked(meUser.likes, users[0].id) === false)
			return res.status(200).json({ message: ErrorMsg, error: ProfileNotLiked });

		await deleteElemToJSONData(db, meUser.likes, users[0].id, meUser.id, 'likes');
		await deleteElemToJSONData(db, users[0].liked_by, meUser.id, users[0].id, 'liked_by');

		//compute fame evol
		await computeFame(db, 'unliked', users[0]);
	}
	return res.status(200).json({ message: SuccessMsg });
}

export async function deleteElemToJSONData(db: Database, data: UserLinkFromDB[], userToDelete: number, userId: number, field: string) {
	const newViewed: UserLinkFromDB[] = data.filter((elem) => elem.id !== userToDelete);
	const newViewedJson = JSON.stringify(newViewed)
	await db.AmendElemsFromTable(
		TableUsersName,
		'id',
		userId,
		[field],
		[newViewedJson],
	);
}