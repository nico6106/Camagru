import { Database } from "./database/db"
import { Request, Response } from 'express';

const express = require('express')
const app = express()

app.use(logger)

console.log('bonjour');



// const db = new Database();

// db.connectDabase();

app.get('/', (req: Request, res: Response) => {
	res.send('Hiii')
})

function logger(req: Request, res: Response, next: any) {
	console.log(req.originalUrl)
	next()
}

app.listen(3333)
