import { type ResultSetHeader } from "mysql2";
import dbConn, { ESTOQUE, MOBILE, PUBLICO, VENDAS } from "../../database/connection/database-connection.ts";
import { type EventRequirement, type ItemEventRequirement } from "./contracts/event-requirement.ts";
import { type loteSerieRequer, type erpRequeriment, type prodRequer } from "./contracts/erpRequirement.ts";
import {type  typeErpIntenalMoviment } from "./contracts/erp-internal-moviment.ts";
import {type table_enviados } from "../../contracts/table-enviados.ts";


type inputInsertMvtoInterno = {
    CHAVE_MVTO: number 
    SETOR: number
    PRODUTO: number
    ENT_SAI: 'S' | 'E'
    QUANTIDADE: number
    OPERADOR: number
    RESPONSAVEL: number  
    HISTORICO: string | null 
    CENTRO_CUSTO: number | null 
    VALOR_UNIT: number
    COD_REQUIS: null | number 
}

export class RequirementDataAcess {


    static async findRequirementErpByCode( code:number ){
            const [arrDataRequerimentErp] = await await dbConn.query(`SELECT * FROM ${VENDAS}.requerimentos WHERE CODIGO = ? `, [code]);
               return arrDataRequerimentErp as erpRequeriment[];
    }

     static async findRequirementSubmitedByCodeMobile( code:number ){
           const sqlVerify = `SELECT * FROM ${MOBILE}.requerimentos WHERE id_mobile = ?;`;
            const [resultVerifyRequirementSubmited] = await dbConn.query(sqlVerify, [code]);
           return  resultVerifyRequirementSubmited as table_enviados[];
    }

    static async insertRequirement(event: EventRequirement): Promise<number> {
        const sqlInsert = `INSERT INTO ${VENDAS}.requerimentos 
            (CODIGO, DATA_REQUER, REQUERENTE, DATA_EFETUACAO, RESPONSAVEL, PEDIDO, CENTRO_CUSTO, ORIGEM, DESTINO, HISTORICO, SITUACAO) 
            VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`;

        const values = [
            event.codigo,
            event.data_requerimento,
            event.requerente,
            event.data_efetuacao,
            event.responsavel,
            event.pedido || 0,
            event.setor_origem,
            event.setor_destino,
            event.historico,
            event.situacao
        ];

        const [result] = await dbConn.query(sqlInsert, values);
        const resultInsert = result as ResultSetHeader;
        return resultInsert.insertId;
    }

        /**
         * 
         * @param event Evento
         * @param codigo codigo do requerimento no sistema
         * @returns 
         */
        static async updateRequirement(event: Omit<EventRequirement, 'codigo'>, codigo:number ): Promise<ResultSetHeader> {
        const sqlUpdate = `UPDATE   ${VENDAS}.requerimentos 
              SET DATA_REQUER = ?,
               REQUERENTE = ?,
               DATA_EFETUACAO = ?,
               RESPONSAVEL = ?,
               PEDIDO = ?,
               ORIGEM = ?,
               DESTINO = ?,
               HISTORICO = ?,
               SITUACAO = ?   
            WHERE CODIGO = ? `;

        const values = [
            event.data_requerimento,
            event.requerente,
            event.data_efetuacao,
            event.responsavel,
            event.pedido || 0,
            event.setor_origem,
            event.setor_destino,
            event.historico,
            event.situacao,
            codigo
        ];

        const [result] = await dbConn.query(sqlUpdate, values);
        const resultInsert = result as ResultSetHeader;
        return resultInsert ;
    }

    /**
     *  registra produtos e lote series no requerimento
     * @param codigoRequer 
     * @param itens 
     */
    static async insertItensRequerimento(codigoRequer: number, itens: ItemEventRequirement[]): Promise<void> {
        for (const item of itens) {
            const sqlInsertItem = `INSERT INTO ${VENDAS}.prod_requer 
                (REQUER, PRODUTO, QUANTIDADE, CUSTO, SEPARADO) 
                VALUES (?, ?, ?, ?, NULL)`;

            const valuesItem = [codigoRequer, item.produto, item.quantidade, item.custo || 0];
            await dbConn.query(sqlInsertItem, valuesItem);

            if (item.lotes_series.length > 0) {
                await this.insertLotesSeriesRequerimento(codigoRequer, item.produto, item.lotes_series);
            }
        }
    }

    /**
     * exclui os produtos do requerimento no sistema
     * @param codigoRequer 
     * @returns 
     */
    static async deleteItensRequeriment(codigoRequer: number){
          const sqlDelete = `DELETE FROM ${VENDAS}.prod_requer WHERE REQUER = ? ;`
        const [resultDelete] =  await dbConn.query(sqlDelete, codigoRequer) ;
            return resultDelete as ResultSetHeader
        }

        /**
         * exclui os lote-series do requerimento do sistema
         * @param codigoRequer 
         * @returns 
         */
    static async deleteLotesSeriesRequerimento(codigoRequer: number )  {
            const sqlDeleteLote = `DELETE  FROM ${VENDAS}.lotes_series_requer 
                 WHERE REQUER = ?;`;

            const [resultDelete] = await dbConn.query(sqlDeleteLote, [codigoRequer]);
             return resultDelete as ResultSetHeader;
        }

 /**
  * registra lote series no requerimento do sistema
  * @param codigoRequer 
  * @param produto 
  * @param lotesSeries 
  */
    static async insertLotesSeriesRequerimento(codigoRequer: number, produto: number, lotesSeries: { lote_serie: number; quantidade: number }[]): Promise<void> {
        for (const lote of lotesSeries) {
            const sqlInsertLote = `INSERT INTO ${VENDAS}.lotes_series_requer SET
                 REQUER = ?, PRODUTO = ?, LOTE_SERIE = ?, QUANTIDADE = ?  
                 ON DUPLICATE KEY UPDATE PRODUTO = ?, LOTE_SERIE = ?, QUANTIDADE = ?`;

            const valuesLote = [codigoRequer, produto, lote.lote_serie, lote.quantidade, 
                 produto, lote.lote_serie, lote.quantidade
            ];
            await dbConn.query(sqlInsertLote, valuesLote);
        }
    }


  static async insertMovimentoLoteSerie(codeInternalMovimentErp: number,  serie: { lote_serie: number; quantidade: number } )  {

            const sqlInsertLote = `INSERT INTO ${ESTOQUE}.mvto_lotes_series 
                (MVTO_INTERNO, LOTE_SERIE,  QUANTIDADE) 
                VALUES (?, ?, ?   )`;
            const valuesLote = [codeInternalMovimentErp,  serie.lote_serie, serie.quantidade];

           const resultInsert= await dbConn.query(sqlInsertLote, valuesLote);

    }


    static async deleteInternalMovementErpByCodeRequirement(codigoRequer: number){
        const [resultDeleteInternalMovementErp] = await dbConn.query(`DELETE FROM ${ESTOQUE}.mvto_interno WHERE COD_REQUIS = ? `, [ codigoRequer])
        return resultDeleteInternalMovementErp as ResultSetHeader
    }
        static async deleteInternalMovementErpByCode(codigoRequer: number){
            const [resultDeleteInternalMovementErp] = await dbConn.query(`DELETE FROM ${ESTOQUE}.mvto_interno WHERE CODIGO = ? `, [ codigoRequer])
            return resultDeleteInternalMovementErp as ResultSetHeader
        }
   
    static async deleteLoteSeriesInternalMovementErp(codigoInternalMoviment: number){
        const [resultDeleteInternalMovementErp] = await dbConn.query(`DELETE FROM ${ESTOQUE}.mvto_lotes_series WHERE MVTO_INTERNO = ? `, [ codigoInternalMoviment])
        return resultDeleteInternalMovementErp as ResultSetHeader
    }
 

    /**
     * 
     * @param codigoRequer codigo do requerimento
     * @param requirement dados do requerimento vindo da requisição HTTP
     */
  static async insertInternalMovementErp(codigoRequer: number, requirement:Omit<EventRequirement, 'codigo'>  )  {
        for (const iten of requirement.itens) {

                let codeMovement= 0;
                for(let i = 1 ; i <= 2 ; i++  ){
                    const sectorMovement = i == 1 ? requirement.setor_origem : requirement.setor_destino; 
                    const entSaiMovement = i == 1 ? 'S' : 'E';

                    const sqlMvtoInterno = `
                        INSERT INTO   ${ESTOQUE}.mvto_interno  SET  
                        CHAVE_MVTO = ? , 
                        SETOR = ? ,
                        PRODUTO = ?,
                        ENT_SAI = ?,
                        QUANTIDADE  = ?,
                        OPERADOR = ?,  
                        RESPONSAVEL = ?,
                        HISTORICO = ?,
                        CENTRO_CUSTO =  ? , 
                        VALOR_UNIT = ?, 
                        COD_REQUIS = ? ;
                        `

                    const values = [  0,  sectorMovement, iten.produto,  entSaiMovement, iten.quantidade  , requirement.requerente, requirement.responsavel,
                        requirement.historico,  0 ,  0,  codigoRequer ];
                        const [arrresultInsertMoviment] =   await dbConn.query(sqlMvtoInterno, values);
                        const  resultInsertMoviment  = arrresultInsertMoviment as ResultSetHeader;
                         codeMovement = resultInsertMoviment.insertId;
                        for( const serie of iten.lotes_series ){
                              await RequirementDataAcess.insertMovimentoLoteSerie(codeMovement, serie );
                            }
                 }

        }
    }




    static async findRequeriments(query: { codigo: number }){
            const { codigo } = query;

                const sql = `select 
                *,
                DATE_FORMAT(DATA_REQUER, '%Y-%m-%d') AS DATA_REQUER,
                DATE_FORMAT(DATA_EFETUACAO, '%Y-%m-%d') AS DATA_EFETUACAO 

                 from ${VENDAS}.requerimentos where codigo = ? ` ;
                
                const values = [ codigo ];
        const [result] = await dbConn.query(sql, values );
        return result as  erpRequeriment[]
    }

    static async findProductsRequeriment(codeRequeriment: number ){

                 const [dataErpProdRequer] = await dbConn.query(`select pr.*, COALESCE(cp.DESCRICAO , '') as DESCRICAO  from ${VENDAS}.prod_requer as pr
                            left join ${PUBLICO}.cad_prod cp on cp.CODIGO = pr.PRODUTO     
                    where pr.requer = '${codeRequeriment}' `);
           return dataErpProdRequer as prodRequer[];
    }

    static async findLoteSeriesRequeriment(codeRequeriment: number ){
              const [ dataLoteSerieRequer ] = await dbConn.query(`SELECT * FROM ${VENDAS}.lotes_series_requer WHERE REQUER =  '${codeRequeriment}'`);
             return  dataLoteSerieRequer as loteSerieRequer[];

    }


    static async checkExistsInternalMovementByCodeRequirement(codeRequeriment:number){
              const sql = ` SELECT * FROM ${ESTOQUE}.mvto_interno  WHERE cod_requis = ? ORDER BY  CODIGO ;`;
             
              const [ dataInternalMovement ] = await dbConn.query( sql,[codeRequeriment]);
              return  dataInternalMovement as typeErpIntenalMoviment[];
    }
}