import { extname } from 'path';
import { Request, Response } from 'express';


export function imageFileFilter(req: Request, res: Response, next: any) {
    if (!req.body.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
		return res
		.status(200)
		.json({ message: 'error', error: 'invalid photo' });
	}
	next();
};

//req, file, callback

export function editFileName(req: Request, res: Response, next: any) {
    const name1 = req.body.originalname.split('.')[0];
    const name = name1.split(' ').join('_');
    const fileExtName = extname(req.body.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
	// req.customData = `${name}-${randomName}${fileExtName}`;
	next();
};
