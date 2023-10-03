import { Request, Response } from 'express';
import { isEmail } from '../../../basic_functions/check-email';
import { isUsername } from '../../../basic_functions/check-username';
import { isName } from '../../../basic_functions/check-name';
import {
    InvalidEmail,
    InvalidFirstName,
    InvalidLastName,
    InvalidUsername,
    MissingEmail,
    MissingFirstName,
    MissingLastName,
    MissingPwd,
    MissingUsername,
} from '../../../shared/errors';

export function validateSignUpBody(req: Request, res: Response, next: any) {
    const { username, email, password, lastname, firstname } = req.body;

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

    next();
}