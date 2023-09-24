import { Database } from "./database/db"
import { Request, Response } from 'express';

const express = require('express')
const app = express()

app.use(logger)

console.log('bonjour')


const db = new Database;
db.connectDb();
// db.selectUsers();

process.on('exit', () => {
	db.client.end()
	  .then(() => {
		console.log('Connexion à la base de données fermée');
	  })
	  .catch((err: any) => {
		console.error('Erreur lors de la fermeture de la connexion à la base de données :', err);
	  });
  });


app.get('/', (req: Request, res: Response) => {
	res.send('Hiii')
})

function logger(req: Request, res: Response, next: any) {
	console.log(req.originalUrl)
	next()
}

app.listen(3333)
