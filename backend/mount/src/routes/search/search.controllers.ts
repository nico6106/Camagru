import { Database } from "../../database/db"
import { Request, Response } from 'express';
import { browsingProfiles } from "./search.service";
import { checkConnected } from "../auth/middlewares/check-connection.middleware";
import { validateSeachSettingsBody } from "./middlewares/check-search-settings.middleware";
import { advancedSearch } from "./advanced-search.service";
import { validateGeolocSearchBody } from "./middlewares/check-geoloc-requested.middleware";
import { dataMap } from "./map.service";

const express = require('express')
const router = express.Router();

//DB
const db = new Database;
db.connectDb();

//routes
router.get('/', checkConnected, (req: Request, res: Response) => {
	return browsingProfiles(db, req, res);
})

router.post('/advanced', checkConnected, validateGeolocSearchBody, validateSeachSettingsBody, (req: Request, res: Response) => {
	return advancedSearch(db, req, res);
})

router.get('/map', checkConnected, (req: Request, res: Response) => {
	return dataMap(db, req, res);
})

module.exports = router
