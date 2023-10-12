import { Request, Response } from 'express';
import { EmptyPhoto, EmptyPhotoId, ErrorMsg, InvalidPhotoExtension, InvalidPhotoId } from '../../../shared/errors';

export function imageFileFilter(req: Request, res: Response, next: any) {
	const { filename } = req.params;
	if (!filename) {
		return res
		.status(200)
		.json({ message: ErrorMsg, error: EmptyPhotoId });
	}
    if (!filename.match(/\.(jpg|jpeg|png|gif)$/)) {
		return res
		.status(200)
		.json({ message: ErrorMsg, error: InvalidPhotoId });
	}
	// if (!filename.match(/^\d+_/)) {
	// 	return res
	// 	.status(200)
	// 	.json({ message: ErrorMsg, error: InvalidPhotoId });
	// }

	next();
};

