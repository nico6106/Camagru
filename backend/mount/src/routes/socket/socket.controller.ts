import { Server, Socket } from 'socket.io';
import http from 'http'; 
import { OnlineUsers } from './socket.users';
import { Database } from '../../database/db';
import { DataSocketChatServ, DataSocketPing } from './socket.type';
import { handleIncomeChatMsg } from '../chat/socket.chat';

export async function handlingSocket(server: http.Server, db: Database, io: Server, users: OnlineUsers) {

	io.on('connection', (socket: Socket) => {
		listenOnSocket(socket, users);
	});

	setInterval(handleInterval, 3000, users);
}

export async function handleInterval(users: OnlineUsers) {
	// users.
}

export async function listenOnSocket(socket: Socket, users: OnlineUsers) {
	console.log('a user connected in '+ socket.id);

	socket.on('ping', (data: DataSocketPing) => {
		handlePing(socket, users, data);
	});

	socket.on('chat-serv', (data: DataSocketChatServ) => {
		handleIncomeChatMsg(socket, users, data);
	});

	socket.on('logout', () => {
		console.log(`user logout with socket ID: ${socket.id}`);
	});

	socket.on('disconnect', () => {
		handleDisconnect(socket, users);
	});
}

export async function handlePing(socket: Socket, users: OnlineUsers, data: DataSocketPing) {
	if (data.id === -1) return ;
	const indexUser: number = users.checkIdUserConnected(data.id);
	if (indexUser === -1) {
		await users.connexionNewUser(data.id, socket.id);
	}
	else {
		await users.updateTime(indexUser, socket.id);
	}
	// console.log('got a ping for '+ socket.id);
}

export async function handleDisconnect(socket: Socket, users: OnlineUsers) {
	console.log(`User disconnected with socket ID: ${socket.id}`);
	const index: number = users.giveUserFromSocket(socket);
	if (index !== -1) 
		await users.deconnectionUser(index, socket.id, false);
}

export async function handleLogout(socket: Socket, users: OnlineUsers) {
	console.log(`User logout with socket ID: ${socket.id}`);
	const index: number = users.giveUserFromSocket(socket);
	if (index !== -1) 
		await users.deconnectionUser(index, socket.id, true);
}