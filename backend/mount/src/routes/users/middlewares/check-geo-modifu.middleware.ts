import { Request, Response } from 'express';
import { ErrorMsg } from '../../../shared/errors';

export function validateGeolocModifyBody(req: Request, res: Response, next: any) {
    const { amend_pos, latitude, longitude } = req.body;
	const numLatitude = parseInt(latitude);
	const numLongitude = parseInt(longitude);
	
    if (!(amend_pos === true || amend_pos === false)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid body' });
    }

	if (amend_pos === true && (isNaN(numLatitude) || isNaN(numLongitude))) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid body' });
    }

    next();
}