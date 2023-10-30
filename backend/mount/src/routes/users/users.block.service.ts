import { TableUser, TableUsersName } from "../../database/data";
import { Database } from "../../database/db";
import { Request, Response } from "express";
import { getUserFromRequest } from "../auth/auth.service";
import { AlreadyBlocked, ErrorMsg, NotConnected, ProfileNotBlocked, SuccessMsg, UnknownUsername } from "../../shared/errors";

export async function blockUser(db: Database, req: Request, res: Response) {
	const { id } = req.params;
	const idNb = parseInt(id);
	const meUser: TableUser | null = await getUserFromRequest(db, req);
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
		// console.log(meUser.id+' block '+users[0].id);
		if (meUser.blocked_user.includes(users[0].id))
			return res.status(200).json({ message: ErrorMsg, error: AlreadyBlocked });
		await db.AmendElemsFromTable(
			TableUsersName,
			'id',
			meUser.id,
			['blocked_user'],
			[[...meUser.blocked_user, users[0].id]],
		);
	}
	return res.status(200).json({ message: SuccessMsg });
}

export async function unblockUser(db: Database, req: Request, res: Response) {
	const { id } = req.params;
	const idNb = parseInt(id);
	const meUser: TableUser | null = await getUserFromRequest(db, req);
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
		// console.log(meUser.id+' unblock '+users[0].id);
		if (!meUser.blocked_user.includes(users[0].id))
			return res.status(200).json({ message: ErrorMsg, error: ProfileNotBlocked });
		const newUnblockedUsers: number[] = meUser.blocked_user.filter((elem) => elem !== users[0].id);
		await db.AmendElemsFromTable(
			TableUsersName,
			'id',
			meUser.id,
			['blocked_user'],
			[newUnblockedUsers],
		);
	}
	return res.status(200).json({ message: SuccessMsg });
}