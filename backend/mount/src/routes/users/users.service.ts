import { TableUser } from "../../database/data";
import { Database } from "../../database/db"
import { Request, Response } from "express";
import { PayloadJWTType } from "../auth/types";
import { getUserFromRequest, verifyJWT } from "../auth/auth.service";


export async function getMe(db: Database, req: Request, res: Response) {
	
	const user: TableUser | null = await getUserFromRequest(db, req);
	if (!user)
		return res.status(200).json({ message: "error", error: "not connected", user: null });
	return res.status(200).json({ message: "success", user: user });
}