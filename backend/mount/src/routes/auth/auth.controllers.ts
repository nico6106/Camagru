import { Request, Response } from 'express';
import { Database } from "../../database/db"
import { validateSignUpBody } from './middlewares/signup.middleware';
import { SignUp } from './auth.service';

const express = require('express')
const router = express.Router();

//DB
const db = new Database;
db.connectDb();

//routes
router.post('/signup', validateSignUpBody, (req: Request, res: Response) => {
	return SignUp(db, req, res);
})

module.exports = router