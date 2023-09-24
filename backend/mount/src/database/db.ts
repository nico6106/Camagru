import { Client, QueryResult } from "pg";
import { ExitStatus } from "typescript";
import { TableUserQuery, TableUsersName } from "./data";
import { connexion_connectDb, connexion_initConnectionDb, connexion_testTable } from "./db-connexions";

export class Database {
  user: string;
  client: any;

  constructor() {
    this.user = "db";
    this.client = new Client({
      host: "dev-db",
      user: "postgres",
      port: 5432,
      password: "n2J5dJGelC0W4UEtiHkMZRrdrSHsLKr7",
      database: "postgres",
    });
  }

  async initConnectionDb(): Promise<boolean>{
	return connexion_initConnectionDb(this);
  }

  async connectDb(): Promise<boolean> {
	return connexion_connectDb(this);
  }

  async testTable(table: string, query: string): Promise<boolean> {
	return connexion_testTable(this, table, query);
  }

  async executeQueryNoArg(query: string): Promise<QueryResult> {
	return new Promise((resolve, reject) => {
		this.client.query(query, (err: Error | null, res: QueryResult) => {
			if (!err) {
			  resolve(res);
			} else {
			  reject(new Error('Error with query'));
			}
		  });
	});
  }

  finalize() {
    // Destructeur (finalize)
	this.client.end;
  }

  async selectTable(table: string): Promise<QueryResult> {
	return new Promise((resolve, reject) => {
		this.client.query(`SELECT * FROM ${table}`, (err: Error | null, res: QueryResult) => {
			if (!err) {
			  resolve(res);
			} else {
			  reject(new Error('no table'));
			}
		  });
	});
  }

}
