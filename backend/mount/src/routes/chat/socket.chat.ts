import { Socket } from "socket.io";
import { OnlineUsers } from "../socket/socket.users";
import { DataSocketChatServ } from "../socket/socket.type";

export async function handleIncomeChatMsg(socket: Socket, users: OnlineUsers, data: DataSocketChatServ) {
	//identify user
	const indexUser: number = users.giveUserFromSocket(socket);
	if (indexUser === -1) return ; //pas de user connu pour cette socket, on ignore
	console.log('msg recu:' + data.message)
}