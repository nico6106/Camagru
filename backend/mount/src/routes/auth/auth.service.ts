import { Request, Response } from 'express';
import { Database } from '../../database/db';

export function SignUp(db: Database, req: Request, res: Response) {
	const { username, email, password, lastname, firstname } = req.body;
	console.log(req.body);

	//check user do not exist
	

	//add user to db
	
	res.status(200).json({message: 'oula new'})
}