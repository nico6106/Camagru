import { Request, Response } from 'express';
import { ErrorMsg } from '../../../shared/errors';
import { isNb } from '../../../basic_functions/check-isNb';

export function validateGeolocModifyBody(req: Request, res: Response, next: any) {
    const { amend_position, latitude, longitude } = req.body;
	const numLatitude = parseFloat(latitude);
	const numLongitude = parseFloat(longitude);
	
    if (!(amend_position === true || amend_position === false)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'error with amend position checkbox' });
    }

	if (!(isNb(latitude) && isNb(longitude))) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid longitude/latitude format' });
    }

	if (isNaN(numLatitude) || isNaN(numLongitude)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid longitude/latitude format' });
    }

	if (!(numLatitude >= -90 && numLatitude <= 90)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid latitude number' });
    }

	if (!(numLongitude >= -180 && numLongitude <= 180)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid longitude number' });
    }

    next();
}