import { Request, Response } from 'express';
import {
	ErrorMsg,
	MissingPwd,
	WeakPwd,
} from '../../../shared/errors';
import { isPassword } from '../../../basic_functions/check-password';

export function validateResetPwdBody(req: Request, res: Response, next: any) {
    const { password } = req.body;

    if (!password) {
        return res.status(200).json({
            message: ErrorMsg,
            error: MissingPwd,
        });
    }

    if (!isPassword(password)) {
        return res.status(200).json({ message: ErrorMsg, error: WeakPwd });
    }

    next();
}