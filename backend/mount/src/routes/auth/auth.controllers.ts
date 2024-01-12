import { Request, Response } from 'express';
import { Database } from "../../database/db"
import { validateSignUpBody } from './middlewares/signup.middleware';
import { SignUp, SignIn, SignOut, ConfirmEmail, testJWT, ForgotPwd, TmpShowUserByEmail, ConfirmForgotPwd, ResetPwd, SignInOauth } from './auth.service';
import { checkConnected } from './middlewares/check-connection.middleware';
import { validateSignInBody } from './middlewares/signin.body.middleware';
import { validateForgotPwdBody } from './middlewares/forgotpwd.middleware';
import { validateConfirmIdParam } from './middlewares/confirm-is.body.middleware';
import { validateResetPwdBody } from './middlewares/check-pwd.body.middleware';
import { validatePwdBody } from './middlewares/check-pwd-signup.middleware';

const express = require('express')
const router = express.Router();

//DB
const db = new Database;
db.connectDb();

//routes
router.post('/signup', validateSignUpBody, validateSignInBody, (req: Request, res: Response) => {
	return SignUp(db, req, res);
})

router.post('/signin', validateSignInBody, (req: Request, res: Response) => {
	return SignIn(db, req, res);
})

router.post('/42', (req: Request, res: Response) => {
	return SignInOauth(db, req, res, '42');
})

router.post('/github', (req: Request, res: Response) => {
	return SignInOauth(db, req, res, 'github');
})

router.post('/google', (req: Request, res: Response) => {
	return SignInOauth(db, req, res, 'google');
})

router.get('/signout', checkConnected, (req: Request, res: Response) => {
	return SignOut(db, req, res);
})

router.get('/confirm/:confirmId', validateConfirmIdParam, (req: Request, res: Response) => {
	return ConfirmEmail(db, req, res);
})

router.post('/test', checkConnected, (req: Request, res: Response) => {
	return testJWT(db, req, res);
})

router.post('/forgotpwd', validateForgotPwdBody, (req: Request, res: Response) => {
	return ForgotPwd(db, req, res);
})

router.post('/showuser', validateForgotPwdBody, (req: Request, res: Response) => {
	return TmpShowUserByEmail(db, req, res);
})

router.get('/forgot/:confirmId', validateConfirmIdParam,(req: Request, res: Response) => {
	return ConfirmForgotPwd(db, req, res);
})

router.post('/forgot/:confirmId', validateConfirmIdParam, validateResetPwdBody,(req: Request, res: Response) => {
	return ResetPwd(db, req, res);
})

module.exports = router