import { Request, Response } from "express";
import { isEmail } from "../../../basic_functions/check-email";
import { isUsername } from "../../../basic_functions/check-username";
import { isName } from "../../../basic_functions/check-name";

export function validateSignUpBody(req: Request, res: Response, next: any) {
  const { username, email, password, lastname, firstname } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Les champs username, email et password sont requis." });
  }

  if (!lastname || !firstname) {
    return res
      .status(400)
      .json({ error: "Missing last name or first name." });
  }

  if (!isEmail(email)) {
    return res
      .status(400)
      .json({ error: "Wrong email format." });
  }

  if (!isUsername(username)) {
    return res
      .status(400)
      .json({ error: "Wrong username format." });
  }

  if (!isName(lastname)) {
    return res
      .status(400)
      .json({ error: "Wrong last name format." });
  }

  if (!isName(firstname)) {
    return res
      .status(400)
      .json({ error: "Wrong first name format." });
  }

  next();
}
