import { Request, Response } from "express";
import { Database } from "../../database/db";
import { QueryResult } from "pg";
import { TableUser, TableUsersName } from "../../database/data";
import { PayloadJWTType } from "./types";
import { sendEmail } from "./mail";
import { generateId } from "../../basic_functions/generate-code";

// links: Record<string, number> = {};

export async function SignUp(db: Database, req: Request, res: Response) {
  const { username, email, password, lastname, firstname } = req.body;
  console.log(req.body);

  //check user/email do not exists
  if (await db.testSelectEntryOneArg(TableUsersName, "username", username))
    return res.status(400).json({ message: "username already exist" });

  if (await db.testSelectEntryOneArg(TableUsersName, "email", email))
    return res.status(400).json({ message: "email already used" });

  const hash = await hashPassword(password);
  const confirmID: string = generateId();
  let retour: QueryResult | null = null;
  let values: string[] = [username, email, firstname, lastname, hash, confirmID];
  const fields: string = "username, email, first_name, last_name, password, email_confirm_id";

  //add user to db
  retour = await db.insertToTable(TableUsersName, fields, values);
  if (retour && retour.rowCount !== 0) {
	//get the user
	const user: TableUser[] | null = await db.selectOneElemFromTable(TableUsersName, 'username', username);
	console.log(user)
	// if (!user)
	// 	return res.status(400).json({ message: "error creating user" });

	//manage sign in with cookie
	// const payload: PayloadJWTType = {
	// 	userId: user[0].id,
    // 	login:user[0].username,
	// }
	// const token = await SignInWithCookie(payload, res);
	sendEmail(username, email, confirmID);

	return res.status(200).json({ message: "success" });
  }
  return res.status(400).json({ message: "error creating user" });
}

export async function hashPassword(password: string): Promise<string> {
  const argon2 = require("argon2");
  let hash = "";
  try {
    hash = await argon2.hash(password);
  } catch (err) {
    hash = "";
  }
  return hash;
}

export async function SignInWithCookie(payload: PayloadJWTType, res: Response): Promise<string | null> {
	const token = await signJWT(payload);
	if (process.env.JWT_ACCESS_TOKEN_COOKIE) {
		res.cookie(process.env.JWT_ACCESS_TOKEN_COOKIE, token);
		// console.log("token=" + token);
		return token;
	}
	else {
		//to handle ?
		return null;
	}
}

export async function SignIn(db: Database, req: Request, res: Response) {
	const { username, password } = req.body;
	const argon2 = require("argon2");

	const user: TableUser[] | null = await db.selectOneElemFromTable(TableUsersName, 'username', username);
	// console.log(user)
	if (!user)
		return res.status(400).json({ message: "unknown user" });
	if (user.length !== 1)
		return res.status(400).json({ message: "error - multiples users" });
	
		//check pwd
	try {
		if (await argon2.verify(user[0].password, password)) {
		  // password match
		} else {
			return res.status(400).json({ message: "incorrect password" });
		}
	  } catch (err) {
		return res.status(400).json({ message: "internal error" });
	  }
	  
	//manage sign in with cookie
	const payload: PayloadJWTType = {
		userId: user[0].id,
    	login:user[0].username,
	}
	const token = await SignInWithCookie(payload, res);
	return res.status(200).json({ message: "success" });
}

export async function SignOut(db: Database, req: Request, res: Response) {
	if (process.env.JWT_ACCESS_TOKEN_COOKIE)
		res.clearCookie(process.env.JWT_ACCESS_TOKEN_COOKIE);
	return res.status(200).json({ message: "success" });
}

export async function ConfirmEmail(db: Database, req: Request, res: Response) {
	const confirmID = req.params.confirmId;
	console.log('confirm')
	//recuperer USER
	const user: TableUser[] | null = await db.selectOneElemFromTable(TableUsersName, 'email_confirm_id', confirmID);
	console.log(user)

	if (!user || user.length !== 1)
		return res.status(400).json({ message: "Error - unknown link" });
	if (user[0].email_verified === true)
		return res.status(400).json({ message: "already validated" });

	db.AmendOneElemFromTable(TableUsersName, 'email_verified', 'id', user[0].id, true);

	return res.status(200).json({ message: "success" });
}

//test
export async function testJWT(db: Database, req: Request, res: Response) {
	console.log('test');

	const token = req.cookies.signin_matcha;
	let decoded: PayloadJWTType | null = null;
	if (token) {
		try {
			decoded = await verifyJWT(token);
			console.log('decoded')
			console.log(decoded)
		} catch (err) {
			return res.status(400).json({ error: "Not connected" });
		}

		if (!decoded)
			return res.status(400).json({msg: 'NOK'})

		const user: TableUser[] | null = await db.selectOneElemFromTable(TableUsersName, 'username', decoded.login);
		console.log(user)
		return res.status(200).json({msg: 'ok'})
	}

	// console.log(req.cookies.signin_matcha)
	// sendEmailTest();
	return res.status(400).json({msg: 'NOK'})
}

export async function signJWT(payload: PayloadJWTType) {
	const jwt = require("jsonwebtoken");
	const token = await jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
		expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
	  });
	return token;
}

export async function verifyJWT(tokenBody: any): Promise<PayloadJWTType | null> {
	const jwt = require("jsonwebtoken");
	try {
		const decoded = jwt.verify(tokenBody, process.env.JWT_ACCESS_TOKEN_SECRET);
		return decoded;
	} catch (err) {
		return null;
	}
}