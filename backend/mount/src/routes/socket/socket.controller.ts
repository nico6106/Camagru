import { Server, Socket } from 'socket.io';
import http from 'http'; 

export function handlingSocket(server: http.Server) {
	const io = new Server(server, {
		cors: {
			origin: `http://${process.env.REACT_APP_SERVER_ADDRESS}:3000`,
			methods: ['GET', 'POST'],
			allowedHeaders: ['Content-Type', 'Authorization'],
			credentials: true,
		},
	});
	
	io.on('connection', (socket: Socket) => {
		console.log('a user connected in '+ socket.id);

		socket.on('ping', (socket: Socket) => {
			console.log('got a ping for '+ socket.id);
		});
	});

	io.on('ping', (socket: Socket) => {
		console.log('got a ping for '+ socket.id);
	});

}