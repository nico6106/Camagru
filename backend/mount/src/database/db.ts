import { Request, Response } from 'express';
import { QueryResult } from 'pg';

const { Client, QueryResult } = require("pg");

const client = new Client({
	host: "dev-db",
	user: "postgres",
	port: 5432,
	password: "n2J5dJGelC0W4UEtiHkMZRrdrSHsLKr7",
	database: "postgres"
})

client.connect();

client.query(`SELECT * FROM users`, (err: Error | null, res: QueryResult) => {
	if (!err) {
		console.log(res.rows);
	} else {
		console.log(err.message);
	}
	client.end;
})

export class Database {
  user: string;

  constructor() {
	this.user = "type";
  }

  connectDabase() {
    console.log("connection");
  }
}
