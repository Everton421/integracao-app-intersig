import dbConn, { PUBLICO } from "../../database/connection/database-connection.ts";
import { type lotes_series } from "./contracts/lotes_series.ts";

export async function getLoteSerie(codigo?: number) {
    let sql = `SELECT ls.* FROM ${PUBLICO}.lotes_series ls`;
    let complement = `;`;
    if (codigo && codigo != undefined) {
        complement = ` WHERE ls.CODIGO = ${codigo};`;
    }
    const finalSql = sql + complement;
    const [result] = await dbConn.query(finalSql);
    return result as lotes_series[];
}
