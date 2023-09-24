import { QueryResult } from "pg";
import { Database } from "./db";

/*check if a field containing 'elem' exists in the table of DB */
export async function test_SelectEntryOneArg(db: Database, table: string, field: string, elem: string): Promise<boolean> {
	const query: string = `SELECT * FROM ${table} WHERE ${field} = $1`;
	const values: any[] = [];
	values.push(elem);
	console.log('values =')
	console.log(values)
	try {
		const retour = await db.executeQueryArgs(query, values)
		if (retour && retour.rowCount !== 0)
			return true;
		return false;
	} catch (err) {
		return false;
	}
} 