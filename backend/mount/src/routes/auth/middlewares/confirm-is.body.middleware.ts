import { Request, Response } from 'express';
import { ErrorMsg, InvalidId } from '../../../shared/errors';
import { isId } from '../../../basic_functions/check-id';

export function validateConfirmIdParam(req: Request, res: Response, next: any) {
    const { confirmId } = req.params;

    if (!confirmId) {
        return res.status(200).json({
            message: ErrorMsg,
            error: InvalidId,
        });
    }

    if (!isId(confirmId)) {
        return res.status(200).json({ message: ErrorMsg, error: InvalidId });
    }

    next();
}
