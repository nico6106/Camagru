import { Request, Response } from 'express';
import { Database } from '../../database/db';
import { QueryResult } from 'pg';
import { TableUsersName } from '../../database/data';

export async function SignUp(db: Database, req: Request, res: Response) {
	const { username, email, password, lastname, firstname } = req.body;
	console.log(req.body);

	//check user/email do not exists
	if (await db.testSelectEntryOneArg(TableUsersName, 'username', username)) 
		return res.status(400).json({message: 'username already exist'})

	if (await db.testSelectEntryOneArg(TableUsersName, 'email', email)) 
		return res.status(400).json({message: 'email already used'})

	

	let retour: QueryResult | null = null;
	let values: string[] = [username, email, firstname, lastname, password];
	const fields: string = "username, email, first_name, last_name, password"

	//add user to db
	retour = await db.insertToTable(TableUsersName, fields, values);
	if (retour && retour.rowCount !== 0)
		return res.status(200).json({message: 'success'});
	return res.status(400).json({message: 'error creating user'})

	console.log(retour)
}