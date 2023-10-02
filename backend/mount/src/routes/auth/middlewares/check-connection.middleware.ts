import { Request, Response } from "express";
import { verifyJWT } from "../auth.service";

export async function checkConnected(req: Request, res: Response, next: any) {
	const token = req.cookies.signin_matcha;
	if (token) {
		try {
			const decoded = await verifyJWT(token);
			if (decoded) {
				next ();
				return ;
			}
			else
				return res.status(200).json({ error: "Not connected" });
		} catch (err) {
			return res.status(200).json({ error: "Not connected" });
		}
	}
	return res.status(200).json({ error: "Not connected" });
}