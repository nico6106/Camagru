import { Request, Response } from 'express';
import { EmptyPhoto, ErrorMsg, InvalidPhotoExtension } from '../../../shared/errors';

export function imageFileFilter(req: Request, res: Response, next: any) {
	const file: Express.Multer.File | undefined = req.file;
	console.log(file)
	if (!file) {
		return res
		.status(200)
		.json({ message: ErrorMsg, error: EmptyPhoto });
	}
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return res
		.status(200)
		.json({ message: ErrorMsg, error: InvalidPhotoExtension });
	}
	next();
};

export function ftImageFileFilter(file: Express.Multer.File | undefined) {
	console.log(file)
	// if (!file) {
	// 	return res
	// 	.status(200)
	// 	.json({ message: ErrorMsg, error: EmptyPhoto });
	// }
    // if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
	// 	return res
	// 	.status(200)
	// 	.json({ message: ErrorMsg, error: InvalidPhotoExtension });
	// }
	return false;
};