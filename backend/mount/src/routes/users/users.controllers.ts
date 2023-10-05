import { Database } from "../../database/db"
import { Request, Response } from 'express';
import { Multer } from 'multer';
import { checkConnected } from "../auth/middlewares/check-connection.middleware";
import { deleteImg, dowloadImg, getMe, imageUpload, updateSettings, uploadImg, verifImgUser } from "./users.service";
import { validateSignUpBody } from "../auth/middlewares/signup.middleware";
import { validateSettings } from "./middlewares/check-settings.middleware";
import { ErrorMsg, PhotoNbLimit } from "../../shared/errors";
import { imageFileFilter } from "./middlewares/photo-middleware";

const express = require('express')
const router = express.Router();
const multer = require('multer');

//DB
const db = new Database;
db.connectDb();

//routes
router.get('/me', checkConnected, (req: Request, res: Response) => {
	return getMe(db, req, res);
})

router.post('/updatesettings', checkConnected, validateSignUpBody, validateSettings, (req: Request, res: Response) => {
	return updateSettings(db, req, res);
})

router.post('/photo', checkConnected, (req: Request, res: Response) => {
	return getMe(db, req, res);
})

router.post('/image', checkConnected, async (req: Request, res: Response) => { 
	const retour = await verifImgUser(db, req, res); 
	if (!retour)
		return res.status(200).json({ message: ErrorMsg, error: PhotoNbLimit });
	imageUpload.single('image')(req, res, (err: any) => {
		if (err) {
			return res.status(200).json({ message: ErrorMsg, error: err.message });
		}
		return uploadImg(db, req, res);
	  });
});

router.get('/image/:filename', checkConnected, imageFileFilter, (req: Request, res: Response) => {
	return dowloadImg(db, req, res); 
});

router.delete('/image/:filename', checkConnected, imageFileFilter, (req: Request, res: Response) => {
	return deleteImg(db, req, res); 
});

module.exports = router
