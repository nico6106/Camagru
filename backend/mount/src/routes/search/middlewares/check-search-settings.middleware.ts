import { Request, Response } from 'express';
import { ErrorMsg, InvalidInterest } from '../../../shared/errors';
import { isIntOnly } from '../../../basic_functions/check-isNb';
import { validateTags } from '../../users/middlewares/check-settings.middleware';

export function validateSeachSettingsBody(req: Request, res: Response, next: any) {
    const { dist_min, dist_max, age_min, age_max, fame_min, fame_max, gender, tags } = req.body;

	//check distance
	if (dist_min && checkElem(dist_min, 0, 200000)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid dist_min format' });
    }
	if (dist_max && checkElem(dist_max, 0, 200000)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid dist_max format' });
    }

	//check age
	if (age_min && checkElem(age_min, 1, 150)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid age_min format' });
    }
	if (age_max && checkElem(age_max, 1, 150)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid age_max format' });
    }

	//check fame
	if (fame_min && checkElem(fame_min, 1, 150)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid fame_min format' });
    }
	if (fame_max && checkElem(fame_max, 1, 150)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid fame_max format' });
    }

	//check gender
	// type AllGenders = 'female' | 'male' | 'Both';
	if (!(gender === 'female' || gender === 'male' || gender === 'Both')) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'invalid gender format' });
    }

	//check tags
	if (!validateTags(tags)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: InvalidInterest });
    }

    next();
}

function checkNumericValue(value: any, min: number, max: number): boolean {
	const valParsed: number = parseInt(value);
	if (!(valParsed >= min && valParsed <= max))
		return false;
	return true;
}

function checkElem(value: any, min: number, max: number): boolean {
	if (!isIntOnly(value)) {
        return false
    }
	if (!checkNumericValue(value, 0, 200000)) {
        return false
    }
	return true;
}