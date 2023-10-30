import { QueryResult } from "pg";
import { Database } from "./db";
import { TableUser } from "./data";

/*select a value in the table*/
export async function exec_AmendOneElemFromTable(db: Database, table: string, field: string, whereField: string, whereId: any , elem: any): Promise<QueryResult | null> {
	const query: string = `UPDATE ${table} SET ${field} = $1 WHERE ${whereField} = ${whereId}`;
	const values: any[] = [];
	values.push(elem);
	try {
		const retour = await db.executeQueryArgs(query, values)
		// console.log(query)
		// console.log(values)
		if (retour && retour.rowCount !== 0) {
			return retour;
		}
		return null;
	} catch (err) {
		return null;
	}
}


export async function exec_AmendElemsFromTable(db: Database, table: string, whereField: string, whereId: any, fields: string[], values: any[]): Promise<QueryResult | null> {
	let setText: string = '';
	if (fields.length !== values.length) return null;
	for (let i: number = 0; i < fields.length; i++) {
		setText = setText + (i > 0 ? ', ' : '') + `${fields[i]} = $${i + 1}`;
	}
	const query: string = `UPDATE ${table} SET ${setText} WHERE ${whereField} = ${whereId}`;
	// const values: any[] = [];
	// values.push(elem);
	try {
		const retour = await db.executeQueryArgs(query, values)
		// console.log(query)
		// console.log(values)
		if (retour && retour.rowCount !== 0) {
			return retour;
		}
		return null;
	} catch (err) {
		return null;
	}
}
