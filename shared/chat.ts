export type ChatRetour = {
	idChat: number;
	idUser: number;
	firstName: string;
	lastName: string;
	picture: string;
	nbUnread: number;
	connected: boolean;
}

export type MsgChatRetour = {
	type: 'text' | 'date' | 'image' | 'video';
	sender: number;
	date: number;
	content: string;
}