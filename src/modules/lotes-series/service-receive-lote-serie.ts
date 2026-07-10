import { type ResultSetHeader } from "mysql2";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE, PUBLICO } from "../../database/connection/database-connection.ts";
import { type EventLoteSerie } from "./contracts/event-lote-serie.ts";
import { LoteSeriesRequest } from "./lotes-series-request.ts";

 

   /**
    * Consulta lote/serie e registra no banco de dados do sistema 
    */
 export class ReceiveLoteSerieService{

    
    static async receiveByEvent(event: EventLoteSerie){
         const  { codigo } = event;
           
         const resultReceiveLoteSerieBydCode = await this.receiveLoteSerieByCode(codigo)

            return  resultReceiveLoteSerieBydCode

    }


     /**
      *  codigo do lote/serie a ser consultado
      * @param codigo 
      */
    static async receiveLoteSerieByCode(codigo: number){


     let resultFunction = { message: null, success:false } as { success:boolean, message:string |null  }

     
         try{
             // consulta loteSerie na api.
             const resultApiLoteSeries = await LoteSeriesRequest.getLoteSeriesRequest(codigo);
             
             if(resultApiLoteSeries && resultApiLoteSeries?.length > 0 ){
                 
                 const { codigo,  lote , produto, serie } = resultApiLoteSeries[0];
                     
                     if(serie != null ){
 
                     }else{
                         resultFunction.message = `[X] Lote/Serie ${codigo} com valor vazio, serie: ${serie} ` 
                           return resultFunction
                     }
 
                   const resultVerifylotesSeriesEnviadas =  await this.verifyReceivedLoteSerie(codigo);

                    if( resultVerifylotesSeriesEnviadas.success){
                            console.log(`[X] Lote/Serie ${codigo} já foi registrada no sistema, serie: ${serie} `);
                            resultFunction.message = `[X] Lote/Serie ${codigo} já foi registrada no sistema, serie: ${serie} ` 
                          resultFunction.success = true;
                           return resultFunction
                     
                     }else{
                                     const sqlInsertLoteSerieSistema = `INSERT INTO ${PUBLICO}.lotes_series SET PRODUTO = ?, LOTE = ?, SERIE = ?, FORNECEDOR= 0, DATA_FABRIC ='0000-00-00' ,DATA_VALID='0000-00-00' `;
                                     const valuesInsert = [produto, lote, serie]
                                     const   [resultInsertLoteSerie]   = await dbConn.query(sqlInsertLoteSerieSistema, valuesInsert);
                                     const resultInsert = resultInsertLoteSerie as ResultSetHeader;
 
                                     if(resultInsert.insertId > 0 ){
                                         const sqlInsertLoteSerieMobileTable = `INSERT INTO ${MOBILE}.lotes_series_enviadas SET id_mobile = ?, codigo_sistema = ?;`
                                         const valuesinsertLoteseriEMobileTable = [ codigo,  resultInsert.insertId]
                                         const [resultInsertLoteSerieEnviada] = await dbConn.query( sqlInsertLoteSerieMobileTable, valuesinsertLoteseriEMobileTable ) as ResultSetHeader[];
 
                                         if( resultInsertLoteSerieEnviada.insertId > 0 ){
                                                 resultFunction.success = true;
                                         }else{
                                                 resultFunction.message = `[X] Algo de inesperado ocorreu ao tentar registrar o lote/serie : ${codigo} na tabela de lote_series_enviadas.`;
                                         }
                                     }else{
                                                 resultFunction.message = `[X] Algo de inesperado ocorreu ao tentar registrar o lote/serie : ${codigo} no banco de dados do sistema.`;
                                     }
                     }
                 
             }else{
                 resultFunction.message =`[X] Lote serie codigo: ${codigo} não foi encontrado na api.` 
             }
         }  catch(e:any){
             console.log(e)
                         resultFunction.message = `[X] Erro ao consultar lote-serie na api, status: ${e.response.status} ` 
 
             }finally{
                 return resultFunction
             }
           
     }


        /**
         * Verifica se o lote serie já foi recebido anteriormente.
         * { success = true }: caso tenha sido recebido.    
         * { success = false }: caso não tenha sido recebido.    
         * @param codigo 
         * @returns 
         */
     static async verifyReceivedLoteSerie(codigo:number){
        const [ lotesSeriesEnviadas  ] = await dbConn.query(`SELECT * FROM ${MOBILE}.lotes_series_enviadas where id_mobile = '${codigo}';`);
                 const arrVerifylotesSeriesEnviadas = lotesSeriesEnviadas as table_enviados[]
 
                     if(arrVerifylotesSeriesEnviadas.length > 0 ){
                        return { success: true , message: null}
                     }else{
                        return { success: false , message: null}
                     }

     }


 }
 
 