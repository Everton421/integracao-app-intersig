import dbConn, { ESTOQUE } from "../../database/connection/database-connection.ts";
import { type  setores } from "./contracts/setores.ts";

export async function getSetores(codigo?:number){
                const baseSQl = `SELECT 
                                        s.*,
                                        DATE_FORMAT(s.DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO
                                        FROM ${ESTOQUE}.setores s `

                let whereClause = `;`;
                    if(codigo && codigo != undefined){

                        whereClause = `WHERE s.CODIGO = ${codigo};`;
                    }
                const sql = baseSQl + whereClause;

                const [ arrSetor] = await dbConn.query(sql);
                    return arrSetor as setores[]
}