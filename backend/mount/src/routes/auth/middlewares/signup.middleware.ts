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
    MissingPwd,
    MissingUsername,
	WeakPwd,
} from '../../../shared/errors';
import { isPassword } from '../../../basic_functions/check-password';
import { isDate } from '../../../basic_functions/check-date';

export function validateSignUpBody(req: Request, res: Response, next: any) {
    const { username, email, password, lastname, firstname, datebirth, gender } = req.body;

    if (!username) {
        return res.status(200).json({
            message: 'error',
            error: MissingUsername,
        });
    }

    if (!email) {
        return res.status(200).json({
            message: 'error',
            error: MissingEmail,
        });
    }

    if (!password) {
        return res.status(200).json({
            message: 'error',
            error: MissingPwd,
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

	if (!isPassword(password)) {
        return res.status(200).json({ message: 'error', error: WeakPwd });
    }

    if (!isEmail(email)) {
        return res.status(200).json({ message: 'error', error: InvalidEmail });
    }

    if (!isUsername(username)) {
        return res
            .status(200)
            .json({ message: 'error', error: InvalidUsername });
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