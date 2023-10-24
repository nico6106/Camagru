import { Database } from "../../database/db"
import { Request, Response } from 'express';
import { browsingProfiles } from "./search.service";

const express = require('express')
const router = express.Router();

//DB
const db = new Database;
db.connectDb();

//routes
router.get('/', (req: Request, res: Response) => {
	return browsingProfiles(db, req, res);
})

module.exports = router
