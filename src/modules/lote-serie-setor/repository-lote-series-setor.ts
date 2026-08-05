import { type ResultSetHeader } from "mysql2";
import dbConn, { ESTOQUE } from "../../database/connection/database-connection.ts";
import { type lote_serie_setor } from "./contracts/lote-serie-setor.ts";

export class RepositoryLoteSerieSetor { 

        static  async updateLoteSerieSetor(  setor:number, produto:number, lote_serie:number,estoque:number  ){
              const sqlUpdateLoteSerieSetor = ` INSERT INTO ${ESTOQUE}.lote_serie_setor SET 
                                                      SETOR = ?,
                                                      PRODUTO =?,
                                                      LOTE_SERIE =?,
                                                      ESTOQUE = ?
                                                          ON DUPLICATE KEY UPDATE 
                                                      ESTOQUE = ? `
    
                    const dataStockSeries = [setor,  produto,  lote_serie, estoque, estoque ];
                  const [resultStockSeries] =   await dbConn.query(sqlUpdateLoteSerieSetor, dataStockSeries)
                    return resultStockSeries as ResultSetHeader 
                }
                

             static async findStockSeriesByProductAndSector( product:number, loteSerie:number, sector:number ){
                const sqlStockSeries = `SELECT * FROM  ${ESTOQUE}.lote_serie_setor WHERE PRODUTO = ? AND LOTE_SERIE = ? AND SETOR = ? `;

                const [arrCurrentStockSeriesAtSourceSector] = await dbConn.query(sqlStockSeries, [product,  loteSerie , sector ]);
                    return arrCurrentStockSeriesAtSourceSector as lote_serie_setor[] ;

                }
}