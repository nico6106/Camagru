import { Request, Response } from 'express';
import { Database } from "../../database/db"
import { validateSignUpBody } from './middlewares/signup.middleware';
import { SignUp, SignIn, SignOut, testJWT } from './auth.service';
import { checkConnected } from './middlewares/check-connection.middleware';
import { validateSignInBody } from './middlewares/signin.body.middleware';

const express = require('express')
const router = express.Router();

//DB
const db = new Database;
db.connectDb();

//routes
router.post('/signup', validateSignUpBody, (req: Request, res: Response) => {
	return SignUp(db, req, res);
})

router.post('/signin', validateSignInBody, (req: Request, res: Response) => {
	return SignIn(db, req, res);
})

router.post('/signout', checkConnected, (req: Request, res: Response) => {
	return SignOut(db, req, res);
})

router.post('/signout', checkConnected, (req: Request, res: Response) => {
	return SignOut(db, req, res);
})

router.post('/test', checkConnected, (req: Request, res: Response) => {
	return testJWT(db, req, res);
})

module.exports = router