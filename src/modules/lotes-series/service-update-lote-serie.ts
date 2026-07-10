import { LoteSeriesRequest } from "./lotes-series-request.ts";
import { type lotes_series } from "./contracts/lotes_series.ts";
import { getLoteSerie } from "./repository-lote-serie.ts";

export class ServiceUpdateLoteSerie {

    static async update(codeLoteSerieErp: number, idLoteSerieMobile: number) {
        let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: any }

        try {
            const resultLoteSerie = await getLoteSerie(codeLoteSerieErp) as lotes_series[];

            if (resultLoteSerie.length === 0) {
                resultfunction.success = false;
                resultfunction.message = `Lote/Serie codigo ${codeLoteSerieErp} não foi encontrado(a)`
            } else {
                const { CODIGO, PRODUTO, LOTE, SERIE } = resultLoteSerie[0];

                const resultRequest = await LoteSeriesRequest.put(
                    {
                        produto: Number(PRODUTO),
                        lote: String(LOTE) || null,
                        serie: String(SERIE) || null
                    },
                    Number(idLoteSerieMobile)
                )

                if (resultRequest.success) {
                    resultfunction.success = true;
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
