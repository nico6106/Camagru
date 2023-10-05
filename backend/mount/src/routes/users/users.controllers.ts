import { Database } from "../../database/db"
import { Request, Response } from "express";
import { checkConnected } from "../auth/middlewares/check-connection.middleware";
import { getMe, updateSettings, uploadImg } from "./users.service";
import { validateSignUpBody } from "../auth/middlewares/signup.middleware";
import { validateSettings } from "./middlewares/check-settings.middleware";

const express = require('express')
const router = express.Router();

// const multer = require('multer');
// // Create multer object
// const imageUpload = multer({
// 	dest: 'images',
// });

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

const multer = require('multer');
// Create multer object
const storage = multer.diskStorage({
	destination: 'images',
	filename: (req: Request, file: any, cb: any) => {
	  cb(null, Date.now() + '-' + file.originalname);
	},
  });

  
const imageUpload = multer({
	dest: 'images',
});

router.post('/image', imageUpload.single('image'), (req: Request, res: Response) => { 
	console.log(req.file);
	return res.status(200).json({ message: 'success' });
	// return uploadImg(db, req, res); 
});



// Image Get Routes
router.get('/image/:filename', (req: Request, res: Response) => {
	// const { filename } = req.params;
    // const dirname = path.resolve();
    // const fullfilepath = path.join(dirname, 'images/' + filename);
    // return res.sendFile(fullfilepath);


    return getMe(db, req, res);
});

module.exports = router
