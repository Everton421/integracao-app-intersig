 
import { type ResultSetHeader } from "mysql2";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { ESTOQUE, MOBILE,   } from "../../database/connection/database-connection.ts";
import { ReceiveLoteSerieService } from "../lotes-series/service-receive-lote-serie.ts";

 
export type LoteSerieSetorInput = {
    setor: number;
    produto: number;
    lote_serie: number;
    estoque: number;
};

 export  class ReceiveLoteSerieSetor {

    static async receive(event: LoteSerieSetorInput){
            let resultReceiveFunction = { success:  false, message: null} as {success:  boolean, message: string | null }

      try{
        
            const  databaseEstoque = `\`${ESTOQUE}\``;
          
            // executa o service de validação da serie, faz a inserção caso nao tenha sido recebida anteriormente.
            await ReceiveLoteSerieService.receiveLoteSerieByCode(event.lote_serie);

            const sqlLoteSeriesEnviadas = `SELECT * FROM ${MOBILE}.lotes_series_enviadas WHERE id_mobile = '${event.lote_serie}';`;
            const [ resultLoteSeriesEnviadas ] = await   dbConn.query(sqlLoteSeriesEnviadas);
            const arrLotesSeriesSetor = resultLoteSeriesEnviadas as table_enviados[];

          // faz o recebimento da serie caso nao existir registro de sincronização
          if(arrLotesSeriesSetor.length > 0 ){
            
               const { codigo_sistema } =arrLotesSeriesSetor[0];
      
               const sqlVerifyLoteSerieSetor = `SELECT * FROM ${databaseEstoque}.lote_serie_setor WHERE PRODUTO = ? AND LOTE_SERIE = ? AND SETOR = ? ;`;
                const values = [event.produto, codigo_sistema,  event.setor]
                const [verifyLoteSerieSetor] = await dbConn.query(sqlVerifyLoteSerieSetor, values);
                const arrVerifyLoteSerieSetor = verifyLoteSerieSetor as { SETOR:number, PRODUTO: number, LOTE_SERIE: string , ESTOQUE: number, id:number }[]

                  
                if(arrVerifyLoteSerieSetor.length > 0 ){

                    const sqlUpdateLoteSerieSetor =  `UPDATE ${databaseEstoque}.lote_serie_setor SET ESTOQUE = ${event.estoque} WHERE PRODUTO = '${event.produto}' AND LOTE_SERIE = '${codigo_sistema}' AND SETOR = '${event.setor}';`;
                    const [verifyLoteSerieSetor] = await dbConn.query(sqlUpdateLoteSerieSetor) as ResultSetHeader[];
                          if( verifyLoteSerieSetor.affectedRows > 0 ){
                              console.log(`[V] atualizado saldo lote-serie ${codigo_sistema}, saldo: ${event.estoque} setor ${event.setor} `)
                                resultReceiveFunction.success = true;
                           }   
                }else{
                
                    const sqlInsertLoteSerieSetor = `INSERT INTO ${databaseEstoque}.lote_serie_setor SET  SETOR = ? , PRODUTO = ?, LOTE_SERIE = ?, ESTOQUE = ? ;`
                    const valuesInsertLoteSerieSetor = [event.setor, event.produto, codigo_sistema, event.estoque ] 

                    const [ resultInsertLoteSerieSetor ] = await dbConn.query(sqlInsertLoteSerieSetor, valuesInsertLoteSerieSetor) as ResultSetHeader[];
                     if( resultInsertLoteSerieSetor.affectedRows > 0 ){
                              console.log(`[V] registrado saldo: ${event.estoque} no setor: ${event.setor} para lote-serie: ${codigo_sistema}.`)
                        resultReceiveFunction.success = true;
                     }   
                }
               
             } else{
                    resultReceiveFunction.success = false;
                    resultReceiveFunction.message = `[X] lote/serie: ${event.lote_serie}  não foi encontrado na tabela da lotes_series_enviadas`
             }

        }catch(e){
            console.log(`[X] Ocorreu um erro ao tentar processar lote-serie-setor `, e )
        }finally{
                return resultReceiveFunction;
        }
    }
}
