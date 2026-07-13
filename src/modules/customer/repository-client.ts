import dbConn, { MOBILE, PUBLICO } from "../../database/connection/database-connection.ts";
import { type  cad_clie } from "./contracts/cad_clie.ts";

export async function getAllClients (codigo?:number, ativo?:'S' | 'N'){

                         let baseSql = ` select *,
                                                DATE_FORMAT(DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                                                DATE_FORMAT(DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD 
                                                from ${PUBLICO}.cad_clie c
                                                `  
                                                 
                                                
                                                const params =[]
                                                const values =[]

                                             if(codigo && codigo != undefined){
                                                   params.push(`c.CODIGO = ? `)
                                                   values.push(codigo)
                                              }

                                             if(ativo && ativo != undefined){
                                                   params.push(`c.ATIVO = ? `)
                                                   values.push(ativo)
                                              }

                                              if(params.length > 0 ){
                                                baseSql = baseSql+ ' WHERE '+ params.join(' AND ');
                                              }
                                                const finalSql = baseSql;
                                                const [ resultVerifyClient  ] = await dbConn.query(finalSql,values);
                                                return resultVerifyClient as cad_clie[];
}