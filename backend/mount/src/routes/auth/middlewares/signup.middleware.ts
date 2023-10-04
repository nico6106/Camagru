import { Request, Response } from 'express';
import { isEmail } from '../../../basic_functions/check-email';
import { isUsername } from '../../../basic_functions/check-username';
import { isName } from '../../../basic_functions/check-name';
import {
	InvalidDateBirth,
    InvalidEmail,
    InvalidFirstName,
    InvalidGender,
    InvalidLastName,
    InvalidUsername,
    MissingDateBirth,
    MissingEmail,
    MissingFirstName,
    MissingGender,
    MissingLastName,
    MissingUsername,
} from '../../../shared/errors';
import { isDate } from '../../../basic_functions/check-date';

export function validateSignUpBody(req: Request, res: Response, next: any) {
    const { email, lastname, firstname, datebirth, gender } = req.body;

    if (!email) {
        return res.status(200).json({
            message: 'error',
            error: MissingEmail,
        });
    }

    if (!firstname) {
        return res.status(200).json({
            message: 'error',
            error: MissingFirstName,
        });
    }

    if (!lastname) {
        return res.status(200).json({
            message: 'error',
            error: MissingLastName,
        });
    }

	if (!datebirth) {
        return res.status(200).json({
            message: 'error',
            error: MissingDateBirth,
        });
    }

	if (!gender) {
        return res.status(200).json({
            message: 'error',
            error: MissingGender,
        });
    }

    if (!isEmail(email)) {
        return res.status(200).json({ message: 'error', error: InvalidEmail });
    }

    if (!isName(lastname)) {
        return res
            .status(200)
            .json({ message: 'error', error: InvalidLastName });
    }

    if (!isName(firstname)) {
        return res
            .status(200)
            .json({ message: 'error', error: InvalidFirstName });
    }

	if (!isDate(datebirth)) {
        return res
            .status(200)
            .json({ message: 'error', error: InvalidDateBirth });
    }

	if (!(gender === 'male' || gender === 'female' || gender === 'other')) {
        return res
            .status(200)
            .json({ message: 'error', error: InvalidGender });
    }

    next();
}