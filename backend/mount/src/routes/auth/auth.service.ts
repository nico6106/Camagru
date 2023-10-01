import { Request, Response } from "express";
import { Database } from "../../database/db";
import { QueryResult } from "pg";
import { TableUsersName } from "../../database/data";
import { PayloadJWTType } from "./types";

export async function SignUp(db: Database, req: Request, res: Response) {
  const { username, email, password, lastname, firstname } = req.body;
  console.log(req.body);

  //check user/email do not exists
  if (await db.testSelectEntryOneArg(TableUsersName, "username", username))
    return res.status(400).json({ message: "username already exist" });

  if (await db.testSelectEntryOneArg(TableUsersName, "email", email))
    return res.status(400).json({ message: "email already used" });

  const hash = await hashPassword(password);
  let retour: QueryResult | null = null;
  let values: string[] = [username, email, firstname, lastname, hash];
  const fields: string = "username, email, first_name, last_name, password";

  //add user to db

  retour = await db.insertToTable(TableUsersName, fields, values);
  if (retour && retour.rowCount !== 0)
    return res.status(200).json({ message: "success" });
  return res.status(400).json({ message: "error creating user" });

  console.log(retour);
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

export async function SignIn(db: Database, req: Request, res: Response) {
  console.log("sign in");
  

  const payload: PayloadJWTType = {
    userId: 1,
    login: "nico",
  };
  
  const token = await signJWT(payload);
  if (process.env.JWT_ACCESS_TOKEN_COOKIE)
  	res.cookie(process.env.JWT_ACCESS_TOKEN_COOKIE, token);
  else {
	//to handle ?
  }
  console.log("token=" + token);
  const { tokenBody } = req.body;
  console.log("tokenBody=" + tokenBody);

  
  const decoded = await verifyJWT(tokenBody);
  console.log(decoded);

  return res.status(200).json({ token: token });
}

export async function testJWT(db: Database, req: Request, res: Response) {
	console.log('test');
	console.log(req.cookies)
	console.log(req.cookies.signin_matcha)
	return res.status(200).json({msg: 'ok'})
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