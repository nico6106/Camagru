import { Request, Response } from 'express';
import { Database } from '../database/db';
import { SuccessMsg } from '../shared/errors';
import { TableUsersName } from '../database/data';
import { hashPassword } from './auth/auth.service';
import { generateId } from '../basic_functions/generate-code';

const csv = require('csv-parser');
const fs = require('fs');

type FormatCSV = {
	prenom: string;
	nom: string;
	sexe: string;
	email: string;
	pseudo: string;
	password: string;
	orientation: string;
	bio: string;
	interests: string;
	profile_picture: string;
	date_birth: string;
	latitude: string;
	longitude: string;
	fame_rating: string;
}
export async function createLife(db: Database, req: Request, res: Response) {
	let retour;

	const results: any = [];
	const prenoms: string[] = [];

  // Remplacez 'votrefichier.csv' par le chemin de votre fichier CSV.
	fs.createReadStream('./data_life.csv')
		.pipe(csv())
		.on('data', (data: any) => results.push(data))
		.on('end', () => {
			// console.log(results);
		loopData(db, results);
		// res.status(200).json({ message: SuccessMsg, error: 'error creating user' });
	});

	return res.status(200).json({ message: SuccessMsg });
}

export async function loopData(db: Database, data: FormatCSV[]) {
	if (data.length === 0) return ;

	for (let i = 0; i < 20; i++) {
		await createOne(db, data, i);
	}

	// for (let i = 0; i < data.length; i++) {
	// 	await createOne(db, data, i);
	// }
	
}

export async function createOne(db: Database, data: FormatCSV[], index: number) {

	console.log(data[index])

	const hash = await hashPassword(data[index].password);
    const confirmID: string = generateId();

	const interests: string[] = data[index].interests.split(',');

	const position = { 
		longitude: parseFloat(data[index].longitude),
		latitude: parseFloat(data[index].latitude),
	};

	let values: any[] = [
        data[index].pseudo,
        data[index].email,
        data[index].prenom,
        data[index].nom,
        hash,
        confirmID,
		data[index].date_birth,
		data[index].sexe,
		data[index].orientation,
		true,
		data[index].bio,
		data[index].profile_picture,
		[data[index].profile_picture],
		interests,
		parseInt(data[index].fame_rating),
		position,
    ];
    const fields: string =
        'username, email, first_name, last_name, password, email_confirm_id, date_birth, gender, preference, email_verified, biography, profile_picture, pictures, interests, fame_rating, position';
	
		//add user to db
    await db.insertToTable(TableUsersName, fields, values);
}
