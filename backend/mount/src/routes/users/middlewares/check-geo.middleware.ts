import { Request, Response } from 'express';
import { ErrorMsg } from '../../../shared/errors';

export function validateGeoBody(req: Request, res: Response, next: any) {
    const { valid, latitude, longitude } = req.body;
	const numLatitude = parseInt(latitude);
	const numLongitude = parseInt(longitude);
	
    if (!(valid === true || valid === false)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid body' });
    }

	if (valid === 'true' && (isNaN(numLatitude) || isNaN(numLongitude))) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid body' });
    }

    next();
}