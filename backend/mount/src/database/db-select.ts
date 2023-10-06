import { QueryResult } from "pg";
import { Database } from "./db";
import { TableUser } from "./data";

/*select a value in the table*/
export async function exec_SelectOneElemFromTable(db: Database, table: string, field: string, elem: string): Promise<TableUser[] | null> {
	const query: string = `SELECT * FROM ${table} WHERE ${field} = $1`;
	const values: any[] = [];
	values.push(elem);
	try {
		const retour = await db.executeQueryArgs(query, values)
		if (retour && retour.rowCount !== 0) {
			return retour.rows;
		}
		return null;
	} catch (err) {
		return null;
	}
}

/*select all values in the table*/
export async function exec_SelectAllElemFromTable(db: Database, table: string): Promise<TableUser[] | null> {
	const query: string = `SELECT * FROM ${table}`;
	try {
		const retour = await db.executeQueryNoArg(query)
		if (retour && retour.rowCount !== 0) {
			return retour.rows;
		}
		return null;
	} catch (err) {
		return null;
	}
}