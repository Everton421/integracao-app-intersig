import dbConn, { PUBLICO } from "../../database/connection/database-connection.ts";
import { type cad_serv } from "./contracts/cad_serv.ts";

export async function getService(codigo?: number) {
    let sql = `SELECT 
                    cs.*,
                    DATE_FORMAT(cs.DATA_CADASTRO, '%Y-%m-%d %H:%i:%s') AS DATA_CADASTRO 
               
                    FROM ${PUBLICO}.cad_serv cs`
    let complement = `;`;
    if (codigo && codigo != undefined) {
        complement = ` WHERE cs.CODIGO = ${codigo};`;
    }
    const finalSql = sql + complement;
    const [result] = await dbConn.query(finalSql);
    return result as cad_serv[];
}
