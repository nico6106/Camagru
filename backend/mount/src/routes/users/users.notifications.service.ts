import { TableChat, TableChatName, TableUser, TableUsersName } from "../../database/data";
import { Database } from "../../database/db";
import { Request, Response } from "express";
import { getUserFromRequest } from "../auth/auth.service";
import { ErrorMsg, SuccessMsg } from "../../shared/errors";
import { OnlineUsers } from "../socket/socket.users";

type FormatNotif = {
	idUser: number;
	picture: string;
	text: string;
	date: number;
}

export type TypeNotif = 'viewed' | 'like' | 'unlike' | 'match';

export async function getNbNotifs(db: Database, req: Request, res: Response) {
	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: ErrorMsg, error: "not connected", user: null });
	const nbNotif: number = user.unread_notif;

	//notif chat
	let nbNotifChat: number = 0;
	const chatsUser: TableChat[] | null =
        await db.SelectElemsFromTableMultiplesArgsOR(
            TableChatName,
            ['id_a', 'id_b'],
            [user.id, user.id],
        );
    if (!chatsUser)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'error loading chats' });
	for (const elem of chatsUser) {
		if (elem.id_a === user.id) {
			if (!user.blocked_user.includes(elem.id_b))
				nbNotifChat = nbNotifChat + elem.unread_a;
		}
		else {
			if (!user.blocked_user.includes(elem.id_a))
				nbNotifChat = nbNotifChat + elem.unread_b;
		}
	}
	return res.status(200).json({ message: SuccessMsg, value: nbNotif, valueChat: nbNotifChat });
}

export async function getNotifs(db: Database, req: Request, res: Response) {	
	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: ErrorMsg, error: "not connected", user: null });
	
	const allUsers: TableUser[] | null = await db.selectAllElemFromTable(TableUsersName);
	if (!allUsers)
		return res.status(200).json({ message: ErrorMsg, error: "servor error", user: null });

	const nbNotif: number = user.unread_notif;
	
	const notifFormated: FormatNotif[] = [];

	for (const elem of user.notifications) {
		const indexUserTmp: number = allUsers.findIndex((e) => elem.id === e.id);
		
		if (indexUserTmp !== -1) {
			let text: string = '';
			if (elem.notif === 'viewed')
				text = `${allUsers[indexUserTmp].first_name} viewed your profile`;
			else if (elem.notif === 'like')
				text = `${allUsers[indexUserTmp].first_name} liked your profile`;
			else if (elem.notif === 'unlike')
				text = `${allUsers[indexUserTmp].first_name} unliked your profile`;
			else if (elem.notif === 'match')
				text = `You just matched with ${allUsers[indexUserTmp].first_name}`;

			const newElem: FormatNotif = {
				idUser: elem.id,
				picture: allUsers[indexUserTmp].profile_picture,
				text: text,
				date: elem.date,
			}

			notifFormated.push(newElem);
		}
	}

	//remet a zero les unread notifs 
	await db.AmendElemsFromTable(
		TableUsersName,
		'id',
		user.id,
		['unread_notif'],
		[0],
	);

	const connectedUsers: OnlineUsers = res.locals.users;
	connectedUsers.sendMsg(user.id, 'notif_raz', 'raz');
	
	if (notifFormated.length > 0)
		notifFormated.reverse()

	return res.status(200).json({ message: "success", notifs: notifFormated, value: nbNotif });
}

export async function handleNotificationCreation(db: Database, res: Response, notif: TypeNotif, userReceive: TableUser, idSend: number) {
	//verif user not blocked
	if (userReceive.blocked_user.includes(idSend))
		return ;

	const now = Date.now();
	//save to DB
	const newData = [...userReceive.notifications, {
		id: idSend,
		date: now,
		notif: notif,
	}]
	const newDataJson = JSON.stringify(newData)
	await db.AmendElemsFromTable(
		TableUsersName,
		'id',
		userReceive.id,
		['notifications', 'unread_notif'],
		[newDataJson, userReceive.unread_notif + 1],
	);

	//send through socket
	const connectedUsers: OnlineUsers = res.locals.users;
	connectedUsers.sendMsg(userReceive.id, 'notif', {
		idUser: idSend,
		date: now,
		notif: notif,
	});
}
