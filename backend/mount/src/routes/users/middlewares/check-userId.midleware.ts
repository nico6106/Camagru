import { Request, Response } from 'express';
import { ErrorMsg, InvalidId } from '../../../shared/errors';

export function validateUserIdFormat(req: Request, res: Response, next: any) {
    const { id } = req.params;
	const idNb = parseInt(id);
	if (isNaN(idNb)) {
		return res
            .status(200)
            .json({ message: ErrorMsg, error: InvalidId });
	}
	if (!(idNb >= 0)) {
		return res
            .status(200)
            .json({ message: ErrorMsg, error: InvalidId });
	}
    next();
}