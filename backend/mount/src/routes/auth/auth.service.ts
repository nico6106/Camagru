import { Request, Response } from 'express';
import { Database } from '../../database/db';
import { QueryResult } from 'pg';
import { TableUser, TableUsersName } from '../../database/data';
import { PayloadJWTType } from './types';
import { sendEmail } from './mail';
import { generateId } from '../../basic_functions/generate-code';
import { generateUniqueUsername } from '../../basic_functions/generate-username';
import {
    EmailNotVerified,
    EmailTaken,
    ErrorMsg,
    InvalidId,
    InvalidPassword,
    SuccessMsg,
    UnknownUsername,
    UsernameTaken,
} from '../../shared/errors';
import {
    getToken,
    getUser,
} from '../../tools/axios';

// links: Record<string, number> = {};

export async function SignUp(db: Database, req: Request, res: Response) {
    const {
        username,
        email,
        password,
        lastname,
        firstname,
        datebirth,
        gender,
    } = req.body;
    // console.log(req.body);

    //check user/email do not exists
    if (await db.testSelectEntryOneArg(TableUsersName, 'username', username))
        return res
            .status(200)
            .json({ message: ErrorMsg, error: UsernameTaken });

    if (await db.testSelectEntryOneArg(TableUsersName, 'email', email))
        return res.status(200).json({ message: ErrorMsg, error: EmailTaken });

    const hash = await hashPassword(password);
    const confirmID: string = generateId();
    let retour: QueryResult | null = null;
    let values: string[] = [
        username,
        email,
        firstname,
        lastname,
        hash,
        confirmID,
        datebirth,
        gender,
    ];
    const fields: string =
        'username, email, first_name, last_name, password, email_confirm_id, date_birth, gender';

    //add user to db
    retour = await db.insertToTable(TableUsersName, fields, values);
    if (retour && retour.rowCount !== 0) {
        //get the user
        const user: TableUser[] | null = await db.selectOneElemFromTable(
            TableUsersName,
            'username',
            username,
        );
        console.log(user);
        const emailBody: string = generateEmailBodyNewUser(username, confirmID);
        sendEmail('Verify your account', email, emailBody);

        return res.status(200).json({ message: SuccessMsg });
    }
    return res
        .status(200)
        .json({ message: ErrorMsg, error: 'error creating user' });
}

function generateEmailBodyNewUser(username: string, confirmID: string): string {
    return `<b>Hey ${username}! </b><br>
	We are happy to have you here at MatchaLove42.<br>
	Please confirm your email using this link : <a href='http://${process.env.REACT_APP_SERVER_ADDRESS}:3000/confirm/${confirmID}'>
	http://${process.env.REACT_APP_SERVER_ADDRESS}:3000/confirm/${confirmID}</a> <br/>`;
}

export async function hashPassword(password: string): Promise<string> {
    const argon2 = require('argon2');
    let hash = '';
    try {
        hash = await argon2.hash(password);
    } catch (err) {
        hash = '';
    }
    return hash;
}

export async function SignInWithCookie(
    payload: PayloadJWTType,
    res: Response,
): Promise<string | null> {
    const token = await signJWT(payload);
    if (process.env.JWT_ACCESS_TOKEN_COOKIE) {
        res.cookie(process.env.JWT_ACCESS_TOKEN_COOKIE, token);
        return token;
    } else {
        //to handle ?
        return null;
    }
}

export async function SignIn(db: Database, req: Request, res: Response) {
    const { username, password } = req.body;
    const argon2 = require('argon2');

    const user: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'username',
        username,
    );
    // console.log(user)
    if (!user)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: UnknownUsername });
    if (user.length !== 1)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'error - multiples users' });

    //check pwd
    try {
        if (await argon2.verify(user[0].password, password)) {
            // password match
        } else {
            return res
                .status(200)
                .json({ message: ErrorMsg, error: InvalidPassword });
        }
    } catch (err) {
        return res
            .status(200)
            .json({ message: ErrorMsg, error: 'internal error' });
    }

    if (user[0].email_verified === false)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: EmailNotVerified });

    //manage sign in with cookie
    const payload: PayloadJWTType = {
        userId: user[0].id,
        login: user[0].username,
    };
    const token = await SignInWithCookie(payload, res);
    return res.status(200).json({ message: SuccessMsg, user: user[0] });
}

export async function SignInOauth(db: Database, req: Request, res: Response, authMethod: string) {
    const { code } = req.body
    let access_token: string
    try {
        access_token = await getToken(code, authMethod)
    } catch (err) {
        console.log(err)
        return
    }
    const { login, email } = await getUser(access_token, authMethod)

    let user: TableUser[] | null = null
    // Find user in db
    if (email) {
        user = await db.selectOneElemFromTable(
            TableUsersName,
            'email',
            email,
        );
    } else {
        user = await db.selectOneElemFromTable(
            TableUsersName,
            'username',
            login,
        );
        if (user && user[0].method !== authMethod) {
            return res
                .status(200)
                .json({ message: ErrorMsg, error: 'error login ' + authMethod });
        }
    }

    if (!user || user.length === 0) {
        const username = await generateUniqueUsername(db, login);
        let retour: QueryResult | null = null;
        let values: string[] = [];
        let fields: string = '';
        values = [
            username,
            email ? email : '',
            authMethod,
        ];
        fields = 'username, email, method';
        retour = await db.insertToTable(TableUsersName, fields, values);
        if (retour && retour.rowCount !== 0) {
            //get the user
            user = await db.selectOneElemFromTable(
                TableUsersName,
                'username',
                username,
            );
        } else {
            return res
                .status(200)
                .json({ message: ErrorMsg, error: 'error login ' + authMethod });
        }
    }

    if (user) {
        //manage sign in with cookie
        const payload: PayloadJWTType = {
            userId: user[0].id,
            login: user[0].username,
        };
        const token = await SignInWithCookie(payload, res);
        return res.status(200).json({ message: SuccessMsg, user: user[0] });
    }
    return res.status(200).json({ message: ErrorMsg, error: 'error login ' + authMethod });
}

export async function SignOut(db: Database, req: Request, res: Response) {
    if (process.env.JWT_ACCESS_TOKEN_COOKIE) {
        res.clearCookie(process.env.JWT_ACCESS_TOKEN_COOKIE);
    }
    return res.status(200).json({ message: SuccessMsg });
}

export async function ConfirmEmail(db: Database, req: Request, res: Response) {
    const confirmID = req.params.confirmId;
    // console.log('confirm');
    //recuperer USER
    const user: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'email_confirm_id',
        confirmID,
    );
    // console.log(user);

    if (!user || user.length !== 1)
        return res.status(200).json({ message: 'unknown link' });
    if (user[0].email_verified === true)
        return res.status(200).json({ message: 'already validated' });

    db.AmendOneElemFromTable(
        TableUsersName,
        'email_verified',
        'id',
        user[0].id,
        true,
    );

    return res.status(200).json({ message: SuccessMsg });
}

//return cookie jwt decoded with user info
export async function decodeUserProfileCookie(
    req: Request,
): Promise<PayloadJWTType | null> {
    const token = req.cookies.signin_matcha;
    let decoded: PayloadJWTType | null = null;
    if (token) {
        try {
            decoded = await verifyJWT(token);
        } catch (err) {
            return null;
        }

        if (!decoded) return null;
    }
    return decoded;
}

//return user from request using cookie jwt token
export async function getUserFromRequest(
    db: Database,
    req: Request,
): Promise<TableUser | null> {
    const decoded = await decodeUserProfileCookie(req);
    if (!decoded) return null;
    const users: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'username',
        decoded.login,
    );
    if (users && users.length === 1) return users[0];
    return null;
}

//test
export async function testJWT(db: Database, req: Request, res: Response) {
    const token = req.cookies.signin_matcha;
    let decoded: PayloadJWTType | null = null;
    if (token) {
        try {
            decoded = await verifyJWT(token);
            // console.log('decoded');
            // console.log(decoded);
        } catch (err) {
            return res.status(400).json({ error: 'Not connected' });
        }

        if (!decoded) return res.status(400).json({ msg: 'NOK' });

        const user: TableUser[] | null = await db.selectOneElemFromTable(
            TableUsersName,
            'username',
            decoded.login,
        );
        // console.log(user);
        return res.status(200).json({ msg: 'ok' });
    }

    // console.log(req.cookies.signin_matcha)
    // sendEmailTest();
    return res.status(400).json({ msg: 'NOK' });
}

export async function signJWT(payload: PayloadJWTType) {
    const jwt = require('jsonwebtoken');
    const token = await jwt.sign(payload, process.env.JWT_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.JWT_ACCESS_TOKEN_DURATION,
    });
    return token;
}

export async function verifyJWT(
    tokenBody: any,
): Promise<PayloadJWTType | null> {
    const jwt = require('jsonwebtoken');
    try {
        const decoded = jwt.verify(
            tokenBody,
            process.env.JWT_ACCESS_TOKEN_SECRET,
        );
        return decoded;
    } catch (err) {
        return null;
    }
}

export async function ForgotPwd(db: Database, req: Request, res: Response) {
    const { email } = req.body;

    //recuperer USER
    const users: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'email',
        email,
    );
    if (!users || users.length !== 1)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: UnknownUsername });
    const user: TableUser = users[0];

    //generate a link to reset pwd
    const confirmID: string = generateId();

    await db.AmendElemsFromTable(
        TableUsersName,
        'id',
        user.id,
        ['reset_pwd'],
        [confirmID],
    );

    //send Email
    const emailBody: string = generateEmailBodyForgotPwd(user.username, confirmID);
    sendEmail('Reset your password', email, emailBody);

    return res.status(200).json({ message: SuccessMsg });
}

function generateEmailBodyForgotPwd(
    username: string,
    confirmID: string,
): string {
    return `<b>Hey ${username}! </b><br>
	Someone requested a password reset for your account.<br>
	To reset your password, please go to : <a href='http://${process.env.REACT_APP_SERVER_ADDRESS}:3000/forgot/${confirmID}'>
	http://${process.env.REACT_APP_SERVER_ADDRESS}:3000/forgot/${confirmID}</a> <br/><br/>
	If it was not you, just ignore this email and nothing will happen`;
}

export async function TmpShowUserByEmail(
    db: Database,
    req: Request,
    res: Response,
) {
    const { email } = req.body;

    //recuperer USER
    const users: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'email',
        email,
    );
    if (!users || users.length !== 1)
        return res
            .status(200)
            .json({ message: ErrorMsg, error: UnknownUsername });
    const user: TableUser = users[0];
    // console.log('------USER------');
    // console.log(user)

    return res.status(200).json({ message: SuccessMsg });
}

export async function ConfirmForgotPwd(
    db: Database,
    req: Request,
    res: Response,
) {
    const confirmID = req.params.confirmId;
    // console.log('confirm');

    //recuperer USER
    const user: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'reset_pwd',
        confirmID,
    );
    // console.log(user);

    if (!user || user.length !== 1)
        return res.status(200).json({ message: ErrorMsg, error: InvalidId });

    return res
        .status(200)
        .json({ message: SuccessMsg, username: user[0].username });
}

export async function ResetPwd(db: Database, req: Request, res: Response) {
    const confirmID = req.params.confirmId;
    const { password } = req.body;
    // console.log('confirm');

    //recuperer USER
    const users: TableUser[] | null = await db.selectOneElemFromTable(
        TableUsersName,
        'reset_pwd',
        confirmID,
    );
    // console.log(users);

    if (!users || users.length !== 1)
        return res.status(200).json({ message: ErrorMsg, error: InvalidId });

    const user: TableUser = users[0];
    const hash = await hashPassword(password);

    //amend user
    await db.AmendElemsFromTable(
        TableUsersName,
        'id',
        user.id,
        ['reset_pwd', 'password'],
        ['', hash],
    );

    return res.status(200).json({ message: SuccessMsg });
}
