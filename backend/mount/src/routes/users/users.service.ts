import { TableUser, TableUsersName } from "../../database/data";
import { Database } from "../../database/db"
import { Request, Response } from "express";
import { getUserFromRequest, verifyJWT } from "../auth/auth.service";
import { AvailableTags } from "../../data/data-tags";
import { EmptyPhoto, ErrorMsg, InvalidPhotoExtension, InvalidPhotoId, PhotoNbLimit, PhotoTooBig, SuccessMsg } from "../../shared/errors";
import { extname } from 'path';
import { UserExport } from "../../shared/userExport";


export async function getMe(db: Database, req: Request, res: Response) {
	
	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: "error", error: "not connected", user: null });
	return res.status(200).json({ message: "success", user: user, tags: AvailableTags });
}

export async function getUserById(db: Database, req: Request, res: Response) {
	const { id } = req.params;
	const idNb = parseInt(id);
	const users: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'id',
        idNb,
    );
    if (!(users && users.length === 1)) 
		return res.status(200).json({ message: "error", error: "not connected", user: null });
	const user: UserExport = transformUserDbInUserExport(users[0]);
	return res.status(200).json({ message: "success", userM: user });
}

export function transformUserDbInUserExport(userDB: TableUser): UserExport {
	// const bio: string = userDB.biography.replace(/\n/g, '<br/>')
	// console.log(bio)
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
		viewed: userDB.viewed,
		viewed_by: userDB.viewed_by,
		likes: userDB.likes,
		liked_by: userDB.liked_by,
		position: userDB.position,
		fame_rating: userDB.fame_rating,
		fake_account: userDB.fake_account,
		connected: userDB.connected,
		last_connection: userDB.last_connection,
		city: 'Paris',
		age: 30,
	}
	return user;
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

	const fs = require('fs');
	fs.stat(fullfilepath, (err: any, stats: any) => {
		if (err) {
		  return res.status(200).json({ message: ErrorMsg, error: InvalidPhotoId });
		}
	  
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
				cb(
					null,
					new Date().valueOf() + 
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