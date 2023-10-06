import { Client, QueryResult } from "pg";
import { connexion_connectDb, connexion_initConnectionDb, connexion_testTable } from "./db-connexions";
import { exec_executeQueryNoArg, exec_executeQueryOneArg, exec_insertToTable } from "./db-execQuery";
import { test_SelectEntryOneArg } from "./db-testEntries";
import { TableUser } from "./data";
import { exec_SelectOneElemFromTable } from "./db-select";
import { exec_AmendElemsFromTable, exec_AmendOneElemFromTable } from "./db-amend";

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

  //select one elem from Table
  async selectOneElemFromTable(table: string, field: string, elem: any): Promise<TableUser[] | null> {
	return exec_SelectOneElemFromTable(this, table, field, elem);
  }

  //UPDATE
  //update $table with $field = $elem WHERE $whereField = $whereId
  async AmendOneElemFromTable(table: string, field: string, whereField: string, whereId: any , elem: any): Promise<QueryResult | null> {
	return exec_AmendOneElemFromTable(this, table, field, whereField, whereId, elem);
  }

  //fields et elems doivent etre dans le meme sens
  async AmendElemsFromTable(table: string, whereField: string, whereId: any, fields: string[], elems: any[]): Promise<QueryResult | null> {
	return exec_AmendElemsFromTable(this, table, whereField, whereId, fields, elems);
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
