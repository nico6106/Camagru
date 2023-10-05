import { Request, Response } from 'express';
import { isUsername } from '../../../basic_functions/check-username';
import { ErrorMsg, InvalidUsername, MissingPwd, MissingUsername } from '../../../shared/errors';

export function validateSignInBody(req: Request, res: Response, next: any) {
    const { username, password } = req.body;

    if (!username) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: MissingUsername });
    }

	if (!password) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: MissingPwd });
    }

    if (!isUsername(username)) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: InvalidUsername });
    }

    next();
}
