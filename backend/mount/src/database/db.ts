import { Client, QueryResult } from "pg";
import { connexion_connectDb, connexion_initConnectionDb, connexion_testTable } from "./db-connexions";
import { exec_executeQueryNoArg, exec_executeQueryOneArg, exec_insertToTable } from "./db-execQuery";
import { test_SelectEntryOneArg } from "./db-testEntries";

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

  //init DB
  async initConnectionDb(): Promise<boolean>{
	return connexion_initConnectionDb(this);
  }

  async connectDb(): Promise<boolean> {
	return connexion_connectDb(this);
  }

  async testTable(table: string, query: string): Promise<boolean> {
	return connexion_testTable(this, table, query);
  }

  //exec
  async executeQueryNoArg(query: string): Promise<QueryResult> {
	return exec_executeQueryNoArg(this, query);
  }

  async executeQueryArgs(query: string, elem: any): Promise<QueryResult | null> {
	try {
		return exec_executeQueryOneArg(this, query, elem);
	} catch (err: any) {
		return null;
	}
  }

  async insertToTable(table: string, fields: string, values: any): Promise<QueryResult | null> {
	try {
		return exec_insertToTable(this, table, fields, values);
	} catch (err: any) {
		return null;
	}
  }

  
  //tests
  async testSelectEntryOneArg(table: string, field: string, elem: string): Promise<boolean> {
	return test_SelectEntryOneArg(this, table, field, elem);
  }

  //end
  finalize() {
    // Destructeur (finalize)
	this.client.end;
  }


  //to replace later
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
