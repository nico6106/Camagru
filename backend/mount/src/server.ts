import { Database } from "./database/db"
import { Request, Response } from 'express';
import { handlingSocket } from "./routes/socket/socket.controller";
import { Server } from "socket.io";
import { OnlineUsers } from "./routes/socket/socket.users";
import { createLife } from "./routes/create-life";

const cookieParser = require('cookie-parser')

const express = require('express')
const app = express()
app.use(logger)
app.use(cookieParser());

//middleware body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // Pour les données de requête JSON
app.use(bodyParser.urlencoded({ extended: true })); // Pour les données de formulaire

//cors
var cors = require('cors');
app.use(cors({
	origin: `http://${process.env.REACT_APP_SERVER_ADDRESS}:3000`,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
	optionsSuccessStatus: 204,
}));

// //ip info
// const ipinfo = require('ipinfo-express')
// app.use(ipinfo({
//     token: `${process.env.IPINFO_TOKEN}`,
//     cache: null,
//     timeout: 5000,
//     ipSelector: null
// }));
app.set('trust proxy', true);

//DB
const db = new Database;
db.initConnectionDb();


//socket-io
const http = require('http');
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: `http://${process.env.REACT_APP_SERVER_ADDRESS}:3000`,
		methods: ['GET', 'POST'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	},
});
//creation users
const users: OnlineUsers = new OnlineUsers(db, io);
//managing socket
handlingSocket(server, db, io, users);

//ajout de users a toutes nos requetes
app.use((req: Request, res: Response, next: any) => {
	res.locals.users = users;
	res.locals.serverIo = io;
	next();
});

//Routes
app.get('/create/life', (req: Request, res: Response) => {
	return createLife(db, req, res);
})

const authRouter = require('./routes/auth/auth.controllers')
app.use('/auth', authRouter)

const usersRouter = require('./routes/users/users.controllers')
app.use('/users', usersRouter)

const chatRouter = require('./routes/chat/chat.controllers')
app.use('/chat', chatRouter)

const searchRouter = require('./routes/search/search.controllers')
app.use('/search', searchRouter)

app.get('/', (req: Request, res: Response) => {
	res.send('Hiii')
})

function logger(req: Request, res: Response, next: any) {
	// console.log(req.originalUrl)
	next()
}

server.listen(3333, () => {
});
