import { TableUser, TableUsersName } from "../../database/data";
import { Database } from "../../database/db"
import { Request, Response } from "express";
import { getUserFromRequest, verifyJWT } from "../auth/auth.service";
import { AvailableTags } from "../../data/data-tags";
import { EmptyPhoto, ErrorMsg, InvalidPhotoExtension, InvalidPhotoId, PhotoNbLimit, PhotoTooBig, SuccessMsg } from "../../shared/errors";
import { extname } from 'path';
import { UserExport, UserShort } from "../../shared/userExport";
import { computeFame } from "./users.fame.service";
import { checkAlreadyLiked } from "./users.likes.service";

export type UserLinkFromDB = {
	id: number;
	date: number;
}

export async function getMe(db: Database, req: Request, res: Response) {
	
	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: ErrorMsg, error: "not connected", user: null });
	return res.status(200).json({ message: "success", user: user, tags: AvailableTags });
}

export async function getUserById(db: Database, req: Request, res: Response) {
	const { id } = req.params;
	const idNb = parseInt(id);
	const meUser: TableUser | null = await getUserFromRequest(db, req);
	const now = Date.now();
	let userLiked: boolean = false;
	let userMatched: boolean = false;
	let userReported: boolean = false;

	if (!meUser)
		return res.status(200).json({ message: ErrorMsg, error: "not connected" });

	const users: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'id',
        idNb,
    );
    if (!(users && users.length === 1)) 
		return res.status(200).json({ message: ErrorMsg, error: "not connected", user: null });
	const user: UserExport = await transformUserDbInUserExport(db, users[0]);

	//handle visit profile (I visit a profile + profile i see get visited)
	if (meUser.id !== user.id) {
		console.log(meUser.id+' visited '+users[0].id)
		await addElemToJSONData(db, meUser.viewed, {id: users[0].id, date: now}, meUser.id, 'viewed');
		await addElemToJSONData(db, users[0].viewed_by, {id: meUser.id, date: now}, users[0].id, 'viewed_by');

		//compute fame evol
		await computeFame(db, 'viewed', users[0]);

		//check if liked and matched
		if (checkAlreadyLiked(meUser.likes, users[0].id))
			userLiked = true;
		if (userLiked && checkAlreadyLiked(users[0].likes, meUser.id))
			userMatched = true;

		//check if reported
		if (checkAlreadyLiked(users[0].fake_account, meUser.id))
			userReported = true;
	}
	
	return res.status(200).json({ message: "success", userM: user, userLiked: userLiked, userMatched: false, userReported: userReported });
}

export async function addElemToJSONData(db: Database, data: UserLinkFromDB[], newData: UserLinkFromDB, userId: number, field: string) {
	const newViewed: UserLinkFromDB[] = [...data, newData];
	const newViewedJson = JSON.stringify(newViewed)
	await db.AmendElemsFromTable(
		TableUsersName,
		'id',
		userId,
		[field],
		[newViewedJson],
	);
}

export async function getListByTypeAndById(db: Database, req: Request, res: Response) {
	const { option, id } = req.params;
	const idNb = parseInt(id);

	const users: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'id',
        idNb,
    );

    if (!(users && users.length === 1)) 
		return res.status(200).json({ message: ErrorMsg, error: "user not found connected" });
	
	const allUsers: TableUser[] | null = await db.selectAllElemFromTable(TableUsersName);
	let userShort: UserShort[] | null = [];

	if (option === 'viewed')
		userShort = transformListConnexionInUserShort(allUsers, users[0].viewed);
	else if (option === 'viewed_by')
		userShort = transformListConnexionInUserShort(allUsers, users[0].viewed_by);
	else if (option === 'likes')
		userShort = transformListConnexionInUserShort(allUsers, users[0].likes);
	else if (option === 'liked_by')
		userShort = transformListConnexionInUserShort(allUsers, users[0].liked_by);
	else if (option === 'matches') {
		const matchedUsers: UserLinkFromDB[] = identifyMatches(users[0].likes, users[0].liked_by);
		userShort = transformListConnexionInUserShort(allUsers, matchedUsers);
	}
	
	return res.status(200).json({ message: "success", userShort: userShort });
}

function identifyMatches(userLikes: UserLinkFromDB[], userLikedBy: UserLinkFromDB[]): UserLinkFromDB[] {
	let matchedUsers: UserLinkFromDB[] = [];
	const idMatched: number[] = userLikes.map((elem) => elem.id);
	for (let i = 0; i < userLikedBy.length; i++) {
		if (idMatched.includes(userLikedBy[i].id)) {
			const newElem: UserLinkFromDB = {
				id: userLikedBy[i].id,
				date: userLikedBy[i].date,
			}
			matchedUsers.push(newElem);
		}
	}
	return matchedUsers;
}

export async function transformUserDbInUserExport(db: Database, userDB: TableUser): Promise<UserExport> {
	const allUsers: TableUser[] | null = await db.selectAllElemFromTable(TableUsersName);

	const user: UserExport = {
		id: userDB.id,
		first_name: userDB.first_name,
		last_name: userDB.last_name,
		username: userDB.username,
		date_birth: userDB.date_birth,
		inscription: userDB.inscription,
		gender: userDB.gender,
		preference: userDB.preference,
		interests: userDB.interests,
		biography: userDB.biography,
		pictures: userDB.pictures,
		profile_picture: userDB.profile_picture,
		blocked_user: userDB.blocked_user,
		viewed: transformListConnexionInUserShort(allUsers, userDB.viewed),
		viewed_by: transformListConnexionInUserShort(allUsers, userDB.viewed_by),
		likes: transformListConnexionInUserShort(allUsers, userDB.likes),
		liked_by: transformListConnexionInUserShort(allUsers, userDB.liked_by),
		position: userDB.position,
		fame_rating: userDB.fame_rating,
		fake_account: userDB.fake_account.length,
		connected: userDB.connected,
		last_connection: userDB.last_connection,
		city: 'Paris',
		age: computeAgeUser(userDB.date_birth),
	}
	return user;
}

function transformListConnexionInUserShort(data: TableUser[] | null, userList: UserLinkFromDB[]): UserShort[] {
	let newList: UserShort[] = [];
	if (!data)
		return newList;
	for (let i = 0; i < userList.length; i++) {
		const indexData: number = data.findIndex((elem) => elem.id === userList[i].id);
		if (indexData !== -1) {
			const newUserShort: UserShort = {
				id: data[indexData].id,
				first_name: data[indexData].first_name,
				last_name: data[indexData].last_name,
				username: data[indexData].username,
				age: computeAgeUser(data[indexData].date_birth),
				profile_picture: data[indexData].profile_picture,
				connected: data[indexData].connected,
				date: new Date(userList[i].date),
			}
			newList.push(newUserShort);
		}
	}
	return newList;
}

function computeAgeUser(dateBirth: Date): number {
	const x = new Date();
	const y = dateBirth;
	const diff = x.getTime() - y.getTime();
	const days = diff / (1000 * 60 * 60 * 24);
	const age = days / 365;
	return Math.trunc(age);
}

export async function updateSettings(db: Database, req: Request, res: Response) {
	const { email, lastname, firstname, datebirth, gender, preference, biography, tags} = req.body;
    console.log('update settings');

    //recuperer USER
    const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: ErrorMsg, error: "not connected", user: null });

    console.log(user);

	//amend user
	db.AmendElemsFromTable(
        TableUsersName,
        'id',
        user.id,
		['email', 'last_name', 'first_name', 'date_birth', 'gender', 'preference', 'interests', 'biography'],
        [email, lastname, firstname, datebirth, gender, preference, tags, biography],
    );

    return res.status(200).json({ message: SuccessMsg });
}


export async function uploadImg(db: Database, req: Request, res: Response) {
	const file: Express.Multer.File | undefined = req.file;
	console.log(file);

	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: ErrorMsg, error: "not connected" });
	if (!file)
		return res.status(200).json({ message: ErrorMsg, error: EmptyPhoto });
	
	const picturesUser: string[] = [...user.pictures, file.filename];

	console.log('now pictures')
	console.log(picturesUser)

	let profilePicture: string = user.profile_picture;

	if (user.pictures.length === 0 || user.profile_picture === '') {
		db.AmendElemsFromTable(
			TableUsersName,
			'id',
			user.id,
			['pictures', 'profile_picture'],
			[picturesUser, file.filename],
		);
		profilePicture = file.filename;
	}
	else {
		db.AmendElemsFromTable(
			TableUsersName,
			'id',
			user.id,
			['pictures'],
			[picturesUser],
		);
	}
	return res.status(200).json({ message: SuccessMsg, info: file.filename, infobis: profilePicture });
}

export async function dowloadImg(db: Database, req: Request, res: Response) {
	const { filename } = req.params;
	const fullfilepath = givePathImage(filename);
	console.log('here ?')

	const fs = require('fs');
	fs.stat(fullfilepath, (err: any, stats: any) => {
		if (err) {
		  return res.status(200).json({ message: ErrorMsg, error: InvalidPhotoId });
		}
	  
		console.log('sending picture')
		return res.sendFile(fullfilepath);
	  });
}

export function givePathImage(filename: string): string {
	const path = require('path');
    const dirname = path.resolve();
    const fullfilepath = path.join(dirname, 'images/' + filename);
	return fullfilepath;
}

export async function deleteImg(db: Database, req: Request, res: Response) {
	const { filename } = req.params;
	const fullfilepath = givePathImage(filename);

	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: ErrorMsg, error: "not connected" });
	
	const picturesUser: string[] = user.pictures;
	//verifie si la photo est bien notre photo
	if (!picturesUser.includes(filename))
		return res.status(200).json({ message: ErrorMsg, error: InvalidPhotoId });

	//update bdd
	let profilePicture: string = user.profile_picture;
	const newListImgUser: string[] = picturesUser.filter((elem) => elem !== filename);
	if (user.profile_picture === filename) {
		let newProfilePicture: string = '';
		if (newListImgUser.length > 0)
			newProfilePicture = newListImgUser[0];
		db.AmendElemsFromTable(
			TableUsersName,
			'id',
			user.id,
			['pictures', 'profile_picture'],
			[newListImgUser, ''],
		);
		profilePicture = newProfilePicture;
	}
	else {
		db.AmendElemsFromTable(
			TableUsersName,
			'id',
			user.id,
			['pictures'],
			[newListImgUser],
		);
	}

	const fs = require('fs');
	fs.unlink(fullfilepath, (err: any) => {
		if (err) {
			return res.status(200).json({ message: ErrorMsg, error: InvalidPhotoId });
		}
	  
		return res.status(200).json({ message: SuccessMsg, info: profilePicture });
	});

}

export async function verifImgUser(db: Database, req: Request, res: Response): Promise<boolean> {
	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return false;
	if (user.pictures.length >= 5)
		return false;
	return true;
}

//handling photo
const multer = require('multer');
export const imageUpload = multer({
	storage: multer.diskStorage(
		{
			destination: function (req: any, file: any, cb: any) {
				cb(null, 'images/');
			},
			filename: function (req: any, file: any, cb: any) {
				const name1 = file.originalname.split('.')[0];
				const name = name1.split(' ').join('_');
				const fileExtName = extname(file.originalname);
				const randomName = Array(8)
					.fill(null)
					.map(() => Math.round(Math.random() * 10).toString(10))
					.join('');
				cb(
					null,
					randomName + 
					'_' +
					name + fileExtName
				);
			},	
		}
	),
	fileFilter: function (req: any, file: any, cb: any) {
		if (file.size > 1024 * 1024) {
			return cb(new Error(PhotoTooBig));
		}
	
		if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
			return cb(new Error(InvalidPhotoExtension));
		}

		cb(null, true);
	},
});

export async function setNewProfileImg(db: Database, req: Request, res: Response) {
	const { filename } = req.params;

	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: ErrorMsg, error: "not connected" });
	
	const picturesUser: string[] = user.pictures;
	//verifie si la photo est bien notre photo
	if (!picturesUser.includes(filename))
		return res.status(200).json({ message: ErrorMsg, error: InvalidPhotoId });

	//update bdd
	if (user.profile_picture !== filename) {
		db.AmendElemsFromTable(
			TableUsersName,
			'id',
			user.id,
			['profile_picture'],
			[filename],
		);
	}
	return res.status(200).json({ message: SuccessMsg, info: filename });
}