import dbConn, { PUBLICO } from "../../database/connection/database-connection.ts";
import { type cad_forn } from "./contracts/cad_forn.ts";

export async function getSupplier(codigo?: number) {
    let sql = `SELECT 
                    f.*,
                    DATE_FORMAT(f.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                    DATE_FORMAT(f.DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD
                    FROM ${PUBLICO}.cad_forn f`
    let complement = `;`;
    if (codigo && codigo != undefined) {
        complement = ` WHERE f.CODIGO = ${codigo};`;
    }
    const finalSql = sql + complement;
    const [result] = await dbConn.query(finalSql);
    return result as cad_forn[];
}
