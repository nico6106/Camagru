import { Request, Response } from 'express';
import { Database } from '../../database/db';
import { TableChat, TableChatName, TableUser, TableUsersName } from '../../database/data';
import { getUserFromRequest } from '../auth/auth.service';
import { ErrorMsg, SuccessMsg } from '../../shared/errors';
import { QueryResult } from 'pg';
import { ChatRetour } from '../../shared/chat';
import { T_ListRequest, giveListIdToRequest } from './tools-db';
import { OnlineUsers } from '../socket/socket.users';

/*retourne all chats: nom, prenom, image_profil, unread_msg*/
export async function getAllChats(db: Database, req: Request, res: Response) {
	//verif me
    const user: TableUser | null = await getUserFromRequest(db, req);
    if (!user)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'not connected' });

	//extract all my chats
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

	//extract all infos of users that are in my chats list
	const ids: number[] = chatsUser.map(item => item.id_a !== user.id ? item.id_a : item.id_b);
	const helpRequest: T_ListRequest = giveListIdToRequest('id', ids);
	const usersCrossCheck: TableUser[] | null =
        await db.SelectElemsFromTableMultiplesArgsOR(
            TableUsersName,
            helpRequest.fields,
            helpRequest.values,
			'id, first_name, last_name, profile_picture'
        );
	if (!usersCrossCheck)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'error loading chats' });

	//generate the new list with names/pictures
	const chatRetour: ChatRetour[] = [];
	for (const elem of chatsUser) {
		const idUser: number = elem.id_a !== user.id ? elem.id_a : elem.id_b;
		const unread: number = elem.id_a === user.id ? elem.unread_a : elem.unread_b;
		const indexUser: number = usersCrossCheck.findIndex((elem) => elem.id === idUser);
		if (indexUser !== -1) {
			const elemChat: ChatRetour = {
				idChat: elem.id,
				idUser: idUser,
				firstName: usersCrossCheck[indexUser].first_name,
				lastName: usersCrossCheck[indexUser].last_name,
				picture: usersCrossCheck[indexUser].profile_picture,
				nbUnread: unread,
				connected: usersCrossCheck[indexUser].connected,
			}
			chatRetour.push(elemChat);
		}
	}

    return res.status(200).json({ message: SuccessMsg, chats: chatRetour });
}

export async function createChatUsers(
    db: Database,
    idUserA: number,
    idUserB: number,
): Promise<boolean> {
    let retour: QueryResult | null = null;

	//check chat does not exist yet
	const valuesTest: number[] = [idUserA, idUserB, idUserB, idUserA];
	const query: string = `SELECT id FROM ${TableChatName} WHERE (id_a = $1 AND id_b = $2) OR (id_a = $3 AND id_b = $4)`;
	retour = await db.executeQueryArgs(query, valuesTest);
	if (!retour || retour.rowCount !== 0) 
		return false;
	
	//add chat to db
    let values: number[] = [idUserA, idUserB];
    const fields: string = 'id_a, id_b';
    retour = await db.insertToTable(TableChatName, fields, values);

    if (retour && retour.rowCount !== 0) {
        return true;
    }
    return false;
}

export async function getChatHistory(db: Database, req: Request, res: Response) {
	const { id } = req.params;
	const idChat = parseInt(id);
	if (idChat === 0) return ;

	//verif me
    const user: TableUser | null = await getUserFromRequest(db, req);
    if (!user)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'not connected' });

	//extract chat
	const chatsUser: TableChat[] | null =
        await db.SelectElemsFromTableMultiplesArgsOR(
            TableChatName,
            ['id'],
            [idChat],
        );
    if (!chatsUser)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'error loading chats' });
	if (chatsUser.length === 0)
		return res
			.status(200)
			.json({ message: ErrorMsg, error: 'No chats' });
		
	const chat: TableChat = chatsUser[0];
	
	console.log('chatsUser:')
	console.log(chatsUser)
	console.log('chat:')
	console.log(chat)

	if (!(user.id === chat.id_a || user.id === chat.id_b))
	return res
		.status(200)
		.json({ message: ErrorMsg, error: 'not your chat' });
	
	const unread: number = user.id === chat.id_a ? chat.unread_a : chat.unread_b;

	//send info to decrease chat notif
	const connectedUsers: OnlineUsers = res.locals.users;
	connectedUsers.sendMsg(user.id, 'chat-read', {
		idChat: chat.id,
		nbRead: unread,
	});
	connectedUsers.sendMsg(user.id, 'chat-read2', {
		idChat: chat.id,
		nbRead: unread,
	});

	//amend nb read
	const fieldUser: string = user.id === chat.id_a ? 'unread_a' : 'unread_b';
	await db.AmendElemsFromTable(
        TableChatName,
        'id',
        chat.id,
        [fieldUser],
        [0],
    );

	return res.status(200).json({ message: SuccessMsg, chats: chat.messages, unread: unread });
}