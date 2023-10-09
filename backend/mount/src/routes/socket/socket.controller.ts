import { Server, Socket } from 'socket.io';
import http from 'http'; 
import { OnlineUsers } from './socket.users';
import { Database } from '../../database/db';
import { DataSocketPing } from './socket.type';

export async function handlingSocket(server: http.Server, db: Database) {
	const io = new Server(server, {
		cors: {
			origin: `http://${process.env.REACT_APP_SERVER_ADDRESS}:3000`,
			methods: ['GET', 'POST'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
		},
	});

	const users: OnlineUsers = new OnlineUsers(db, io);
	
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