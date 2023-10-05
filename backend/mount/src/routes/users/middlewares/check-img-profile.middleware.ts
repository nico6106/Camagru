import { Request, Response } from 'express';
import { ErrorMsg, InvalidIPreference } from '../../../shared/errors';
import { getUserFromRequest, verifyJWT } from '../../auth/auth.service';
import { TableUser } from '../../../database/data';

export async function validateSettings(req: Request, res: Response, next: any) {
    // const user: TableUser | null = await getUserFromRequest(db, req);
	// if (!user)
		return res.status(200).json({ message: "error", error: "not connected", user: null });
    next();
}