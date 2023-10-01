import { Request, Response } from 'express';
import { Database } from "../../database/db"
import { validateSignUpBody } from './middlewares/signup.middleware';
import { SignUp, SignIn, testJWT } from './auth.service';

const express = require('express')
const router = express.Router();

//DB
const db = new Database;
db.connectDb();

//routes
router.post('/signup', validateSignUpBody, (req: Request, res: Response) => {
	return SignUp(db, req, res);
})

router.post('/signin', (req: Request, res: Response) => {
	return SignIn(db, req, res);
})

router.post('/test', (req: Request, res: Response) => {
	return testJWT(db, req, res);
})

module.exports = router