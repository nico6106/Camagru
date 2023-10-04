import { Database } from "../../database/db"
import { Request, Response } from "express";
import { checkConnected } from "../auth/middlewares/check-connection.middleware";
import { getMe } from "./users.service";
import { validateSignUpBody } from "../auth/middlewares/signup.middleware";
import { validateSettings } from "./middlewares/check-settings.middleware";

const express = require('express')
const router = express.Router();

//DB
const db = new Database;
db.connectDb();

//routes
router.get('/me', checkConnected, (req: Request, res: Response) => {
	return getMe(db, req, res);
})

router.post('/updatesettings', checkConnected, validateSignUpBody, validateSettings, (req: Request, res: Response) => {
	return getMe(db, req, res);
})

module.exports = router