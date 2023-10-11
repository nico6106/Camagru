import { Database } from '../../database/db';
import { Request, Response } from 'express';
import { checkConnected } from '../auth/middlewares/check-connection.middleware';
import { getAllChats, getChatHistory } from './chat.service';
import { validateUserIdFormat } from '../users/middlewares/check-userId.midleware';

const express = require('express');
const router = express.Router();

//DB
const db = new Database();
db.connectDb();

router.get('/all', checkConnected, (req: Request, res: Response) => {
    return getAllChats(db, req, res);
});

router.get('/:id', checkConnected, validateUserIdFormat, (req: Request, res: Response) => {
    return getChatHistory(db, req, res);
});

/*
routes:
	GET chats
	GET chat/:id
*/

module.exports = router;
