import { Request, Response } from "express";
import { isUsername } from "../../../basic_functions/check-username";

export function validateSignInBody(req: Request, res: Response, next: any) {
	const { username, password } = req.body;

	if (!username || !password) {
		return res
		  .status(400)
		  .json({ error: "Missing username or password" });
	  }

	if (!isUsername(username)) {
		return res
		  .status(400)
		  .json({ error: "Wrong username format." });
	  }

	next();
}