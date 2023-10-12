import { Socket } from 'socket.io';
import { OnlineUsers } from '../socket/socket.users';
import { DataSocketChatServ } from '../socket/socket.type';
import { ChatMessage, TableChat, TableChatName } from '../../database/data';
import { Database } from '../../database/db';
import { MsgChatRetour } from '../../shared/chat';

type SocketReceiveMsg = {
	idChat: number;
	msg: MsgChatRetour;
};

export async function handleIncomeChatMsg(
    db: Database,
    socket: Socket,
    users: OnlineUsers,
    data: DataSocketChatServ,
) {
    //identify user
    const indexUser: number = users.giveUserFromSocket(socket);
    if (indexUser === -1) return; //pas de user connu pour cette socket, on ignore
    console.log('msg recu:' + data.message);

    //get chat info
    const chatsUser: TableChat[] | null =
        await db.SelectElemsFromTableMultiplesArgsOR(
            TableChatName,
            ['id'],
            [data.idChat],
        );
    if (!chatsUser) return;
    if (chatsUser.length === 0) return;

    const chat: TableChat = chatsUser[0];

    const newElemChat: ChatMessage = {
        sender: users.users[indexUser].idUser,
        date: Date.now(),
        content: data.message,
    };
    const newChatMessage: ChatMessage[] = [...chat.messages, newElemChat];
	const newChatMessageJson = JSON.stringify(newChatMessage);

    //amend table chats
    const fieldUserUnread: string = users.users[indexUser].idUser === chat.id_a ? 'unread_b' : 'unread_a';
    const valueUserUnread: number = users.users[indexUser].idUser === chat.id_a ? chat.unread_b + 1 : chat.unread_a + 1;
    await db.AmendElemsFromTable(
        TableChatName,
        'id',
        chat.id,
        [fieldUserUnread, 'messages'],
        [valueUserUnread, newChatMessageJson],
    );

    //send chat to other users
	const elemToSend: SocketReceiveMsg = {
		idChat: data.idChat,
		msg: newElemChat,
	}
	console.log('sending msg:')
	console.log(elemToSend)
	users.sendMsg(chat.id_a, 'chat', elemToSend);
	users.sendMsg(chat.id_b, 'chat', elemToSend);
	users.sendMsg(chat.id_a, 'chat2', elemToSend);
	users.sendMsg(chat.id_b, 'chat2', elemToSend);
}
