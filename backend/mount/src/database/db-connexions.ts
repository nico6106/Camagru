import { QueryResult } from "pg";
import { TableUserQuery, TableUsersName } from "./data";
import { Database } from "./db";

export async function connexion_initConnectionDb(db: Database): Promise<boolean> {
  try {
    await db.client.connect();
    // console.log("DB connection OK");

    //test Users
    if (!db.testTable(TableUsersName, TableUserQuery)) return false;

    return true;
  } catch (err) {
    return false;
  }
}

export async function connexion_connectDb(db: Database): Promise<boolean> {
  try {
    await db.client.connect();
    // console.log("DB bis connection OK");
    return true;
  } catch (err) {
    return false;
  }
}

export async function connexion_testTable(db: Database, table: string, query: string): Promise<boolean> {
	try {
		const retourDbUser: QueryResult = await db.selectTable(table);
		return true;
	}
	catch (err: any) {
		if (err.message === 'no table') {
			//creer tables
			console.log('table a creer')

			try {
				await db.executeQueryNoArg(query);
				return true;
			} catch (err) {
				return false;
			}
		}
		else
			return false;
	}
  }