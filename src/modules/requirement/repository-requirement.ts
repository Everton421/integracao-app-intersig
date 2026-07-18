import { type ResultSetHeader } from "mysql2";
import dbConn, { VENDAS } from "../../database/connection/database-connection.ts";
import { type EventRequirement, type ItemEventRequirement } from "./contracts/event-requirement.ts";

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
}