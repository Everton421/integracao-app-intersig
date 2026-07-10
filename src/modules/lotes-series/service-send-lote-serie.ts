import { type ResultSetHeader } from "mysql2";
import dbConn, { MOBILE } from "../../database/connection/database-connection.ts";
import { LoteSeriesRequest } from "./lotes-series-request.ts";
import { type lotes_series } from "./contracts/lotes_series.ts";
import { getLoteSerie } from "./repository-lote-serie.ts";

export class ServiceSendLoteSerie {
    static async send(codeLoteSerieErp: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any }

        try {
            const resultLoteSerie = await getLoteSerie(codeLoteSerieErp) as lotes_series[];

            if (resultLoteSerie.length === 0) {
                resultfunction.success = false;
                resultfunction.message = `Lote/Serie codigo ${codeLoteSerieErp} não foi encontrado(a)`
            } else {
                const { CODIGO, PRODUTO, LOTE, SERIE } = resultLoteSerie[0];

                const resultRequest = await LoteSeriesRequest.post(
                    {
                        codigo: Number(CODIGO),
                        produto: Number(PRODUTO),
                        lote: String(LOTE) || null,
                        serie: String(SERIE) || null
                    }
                )

                if (resultRequest.success) {
                    if (resultRequest.data && resultRequest.data.codigo) {
                        const { codigo } = resultRequest.data;

                        const sqlInsert = `INSERT INTO ${MOBILE}.lotes_series_enviadas (id_mobile, codigo_sistema) VALUES (?, ?)`;
                        const values = [codigo, codeLoteSerieErp];
                        const [{ insertId }] = await dbConn.query(sqlInsert, values) as ResultSetHeader[];
                        if (insertId > 0) {
                            resultfunction.success = true;
                        } else {
                            resultfunction.success = false;
                            resultfunction.message = `[X] Algo inesperado ocorreu ao tentar registrar lote/serie[ERP] ${codeLoteSerieErp} na tabela lotes_series_enviadas.`;
                        }
                    }
                } else {
                    resultfunction.data = resultRequest.data;
                    resultfunction.success = resultRequest.success;
                    resultfunction.message = resultRequest.message;
                }
            }

        } catch (e) {
            resultfunction.success = false;
            resultfunction.message = String(e);
        } finally {
            return resultfunction;
        }

    }
}
