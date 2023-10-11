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
	idSender: number;
	date: number;
	content: string;
}