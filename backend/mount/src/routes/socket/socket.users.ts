import { Server, Socket } from "socket.io";
import { Database } from "../../database/db";
import { ConnectedUser } from "./socket.type";
import { TableUser, TableUsersName } from "../../database/data";

export class OnlineUsers {
	users: ConnectedUser[] = [];

	constructor(private db: Database, private io: Server) {
        this.users = [];
    }

	//add user
	async connexionNewUser(idUser: number, socketId: string) {
		//verif client existe
		const users: TableUser[] | null = await this.db.selectOneElemFromTable(
			TableUsersName,
			'id',
			idUser,
		);
		if (!(users && users.length === 1)) 
			return ;
		const user: TableUser = users[0];

		//update connected users array
		const newUser: ConnectedUser = {
			idUser: idUser,
			sockets: [socketId],
			lastPingTime: Date.now(),
			connected: true,
			matches: user.matches,
		}
		const size: number = this.users.push(newUser);

		//update DB
		await this.updateDBStatus(this.users[size - 1].idUser, true);
		
		//alert friends
		this.alertFriends(idUser, 'updateStatus', {
			idUser: idUser,
			type: 'connect',
			lastSeen: Date.now()
		});

		console.log('user '+idUser+' added socket='+socketId)
	}

	//if force = true, vient de logout (et force deconnexion)
	async deconnectionUser(index: number, socketId: string | null, force: boolean) {
		if (!force && socketId !== null) {
			const newSocketsUser: string[] = this.users[index].sockets.filter((elem) => elem !== socketId);
			this.users[index].sockets = newSocketsUser;
		}
		else
			this.users[index].sockets = []; //force=true

		if (this.users[index].sockets.length === 0) {
			const userId: number = this.users[index].idUser;

			//update DB
			await this.updateDBStatus(userId, false);

			//alert friends
			this.alertFriends(this.users[index].idUser, 'updateStatus', {
				idUser: this.users[index].idUser,
				type: 'disconnect',
				lastSeen: Date.now()
			});

			//update status in array
			this.users[index].connected = false;

			console.log('user '+userId+' removed socket='+socketId)
		}
		
	}

	private async updateDBStatus(userId: number, status: boolean) {
		// return ;
		await this.db.AmendElemsFromTable(
			TableUsersName,
			'id',
			userId,
			['connected', 'last_connection'],
			[status, new Date()],
		);
	}

	async updateTime(index: number, socketId: string) {
		if (!this.users[index].sockets.includes(socketId))
			this.users[index].sockets.push(socketId)
		this.users[index].lastPingTime = Date.now();

		if (!this.users[index].connected) {
			this.users[index].connected = true;

			//update DB
			await this.updateDBStatus(this.users[index].idUser, true);

			//alert friends
			this.alertFriends(this.users[index].idUser, 'updateStatus', {
				idUser: this.users[index].idUser,
				type: 'connect',
				lastSeen: Date.now()
			});
		}
	}

	//send a message to all friends of a user
	alertFriends(idUser: number, title: string, body: any) {
		console.log('alert friend')
		const index: number = this.users.findIndex((elem) => elem.idUser === idUser);
		if (index !== -1) {
			if (this.users[index].matches.length === 0) return ;
			for (let i = 0; i < this.users[index].matches.length; i++) {
				this.sendMsg(this.users[index].matches[i], title, body);
			}
		}
	}

	//send a message to all known sockets id of a user
	sendMsg(toId: number, title: string, body: any) {
		const index: number = this.users.findIndex((elem) => elem.idUser === toId);
		if (index === -1) return ; //not connected
		if (this.users[index].connected === false) return ; //not connected
		if (this.users[index].sockets.length === 0) return ; //not connected
		for (let i = 0; i < this.users[index].sockets.length; i++) {
			this.io.to(this.users[index].sockets[i]).emit(title, body);
			console.log('send msg to '+toId+':'+this.users[index].sockets[i]+', say:'+title+'='+body.idUser+'-'+body.type);
		}
	}

	tbd() {
		console.log('ok so we get here');
		console.log('nb users='+this.users.length);
		console.log('user[0]: '+this.users[0].idUser+', connected:' +this.users[0].connected);
		console.log(this.users[0].sockets);
		// this.io.emit("hello", "world", (error: any) => { 
		// 	console.log('hello world')
		// 	console.log(error)});
		// this.io.to(this.users[0].sockets[0]).emit("hello", "world 1", (error: any) => { 
		// 	console.log('hello world1')
		// 	console.log(error)})
	}

	//check if user is connected. If yes, return nb>0, else -1
	checkIdUserConnected(idUser: number): number {
		const index: number = this.users.findIndex((elem) => elem.idUser === idUser)
		return index;
	}

	giveUserFromSocketId(socket: string): number {
		const index: number = this.users.findIndex((elem) => elem.sockets.includes(socket))
		return index;
	}

	giveUserFromSocket(socket: Socket): number {
		const index: number = this.users.findIndex((elem) => elem.sockets.includes(socket.id));
		return index;
	}

	//verif users connected
	async verifAllConnexions() {
		const now: number = Date.now();
		if (this.users.length === 0) return ;
		for (let i = 0; i < this.users.length; i++) {
			if (this.users[i].connected) {
				if (now - this.users[i].lastPingTime > 3000) {
					this.deconnectionUser(this.users[i].idUser, null, true);
				}
			}
		}
	}

	addViewerToUser(idUserViewed: number, idUserViewer: number) {
		const indexViewer: number = this.users.findIndex((elem) => elem.idUser === idUserViewer)
		const indexViewed: number = this.users.findIndex((elem) => elem.idUser === idUserViewed)
		if (indexViewer === -1 || indexViewed === -1) return ;
		const findIndex: number = this.users[indexViewed].matches.findIndex((elem) => elem === idUserViewer);
		if (findIndex !== -1) return ;
		this.users[indexViewed].matches.push(idUserViewer);
	}
} 