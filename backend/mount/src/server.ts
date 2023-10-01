import { Database } from "./database/db"
import { Request, Response } from 'express';

const cookieParser = require('cookie-parser')

const express = require('express')
const app = express()
app.use(logger)
app.use(cookieParser());

console.log('bonjour')

//middleware body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Pour les données de requête JSON
app.use(bodyParser.urlencoded({ extended: true })); // Pour les données de formulaire

//DB
const db = new Database;
db.initConnectionDb();

//Routes
const authRouter = require('./routes/auth/auth.controllers')
app.use('/auth', authRouter)

app.get('/', (req: Request, res: Response) => {
	res.send('Hiii')
})

function logger(req: Request, res: Response, next: any) {
	console.log(req.originalUrl)
	next()
}

app.listen(3333)
