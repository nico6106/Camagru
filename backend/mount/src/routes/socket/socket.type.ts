export type ConnectedUser = {
	idUser: number;
	sockets: string[];
	lastPingTime: number;
	connected: boolean;
	matches: number[];
}

export type DataSocketPing = {
	id: number;
	idConnection?: string;
}

export type DataSocketChatServ = {
	type: 'text' | 'date' | 'image' | 'video';
	idChat: number;
	message: string;
}