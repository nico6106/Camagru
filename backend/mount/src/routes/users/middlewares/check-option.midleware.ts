import { Request, Response } from 'express';
import { ErrorMsg, InvalidId } from '../../../shared/errors';

export function validateOptionFormat(req: Request, res: Response, next: any) {
    const { option } = req.params;
	const dataCheck: string[] = ['viewed', 'viewed_by', 'likes', 'liked_by'];
	if (!dataCheck.includes(option))
		return res
		.status(200)
		.json({ message: ErrorMsg, error: 'Invalid option' });

    next();
}