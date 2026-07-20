import { type ResultSetHeader } from "mysql2";
import dbConn, { PUBLICO, VENDAS } from "../../database/connection/database-connection.ts";
import { type EventRequirement, type ItemEventRequirement } from "./contracts/event-requirement.ts";
import { type loteSerieRequer, type erpRequeriment, type prodRequer } from "./contracts/erpRequirement.ts";

export class RequirementRepository {

    static async insertRequirement(event: EventRequirement): Promise<number> {
        const sqlInsert = `INSERT INTO ${VENDAS}.requerimentos 
            (DATA_REQUER, REQUERENTE, DATA_EFETUACAO, RESPONSAVEL, PEDIDO, CENTRO_CUSTO, ORIGEM, DESTINO, HISTORICO, SITUACAO) 
            VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`;

        const values = [
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

        if (resultInsert.insertId > 0 && event.itens.length > 0) {
            await this.insertItensRequerimento(resultInsert.insertId, event.itens);
        }

        return resultInsert.insertId;
    }

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

    static async insertLotesSeriesRequerimento(codigoRequer: number, produto: number, lotesSeries: { lote_serie: number; quantidade: number }[]): Promise<void> {
        for (const lote of lotesSeries) {
            const sqlInsertLote = `INSERT INTO ${VENDAS}.lotes_series_requer 
                (REQUER, PRODUTO, LOTE_SERIE, QUANTIDADE) 
                VALUES (?, ?, ?, ?)`;

            const valuesLote = [codigoRequer, produto, lote.lote_serie, lote.quantidade];
            await dbConn.query(sqlInsertLote, valuesLote);
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
}