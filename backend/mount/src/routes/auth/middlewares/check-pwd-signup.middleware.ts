import { Request, Response } from 'express';
import {
    MissingPwd,
	WeakPwd,
} from '../../../shared/errors';
import { isPassword } from '../../../basic_functions/check-password';

export function validatePwdBody(req: Request, res: Response, next: any) {
    const { password } = req.body;

    if (!password) {
        return res.status(200).json({
            message: 'error',
            error: MissingPwd,
        });
    }

	if (!isPassword(password)) {
        return res.status(200).json({ message: 'error', error: WeakPwd });
    }

    next();
}