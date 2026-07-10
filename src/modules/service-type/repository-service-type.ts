import dbConn, { PUBLICO } from "../../database/connection/database-connection.ts";
import { type tipos_os } from "./contracts/tipos_os.ts";

export async function getServiceType(codigo?: number) {
    let sql = `SELECT 
                    t.* 
                    FROM ${PUBLICO}.tipos_os t`
    let complement = `;`;
    if (codigo && codigo != undefined) {
        complement = ` WHERE t.CODIGO = ${codigo};`;
    }
    const finalSql = sql + complement;
    const [result] = await dbConn.query(finalSql);
    return result as tipos_os[];
}
