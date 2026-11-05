import { type event } from "../../../contracts/event.ts";
import { ApiClient } from "../../../services/api-client.ts";
import { api } from "../../../services/api.ts";
import { delay } from "../../../utils/delay.ts";
import { type lote_serie_setor } from "../contracts/lote-serie-setor.ts";
import { LoteSerieSectorRepository } from "../repository/lote-serie-respository.ts";

type responseBulUpdateLoteSerieSector = {
    success: boolean,
    message: string,
    lote_id: string
}

export class LoteSerieSetorShipping {
    private loteSerieSectorRepository: LoteSerieSectorRepository
    private api: ApiClient;

    constructor(loteSerieSectorRepository: LoteSerieSectorRepository, api: ApiClient) {
        this.loteSerieSectorRepository = loteSerieSectorRepository;
        this.api = api;
    }

    async SendLoteSerieSectorByEvent(event: event) {
        const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

        const arrLotesSeriesSetor = await this.loteSerieSectorRepository.findById( event.id_registro);

        if (arrLotesSeriesSetor.length > 0) {

            const { ESTOQUE, LOTE_SERIE, PRODUTO, SETOR, id } = arrLotesSeriesSetor[0];

            try {
                await api.put("/lote-serie-setor", {
                    setor: Number(SETOR),
                    produto: Number(PRODUTO),
                    lote_serie: Number(LOTE_SERIE),
                    estoque: Number(ESTOQUE)
                },

                    {
                        headers: {
                            source: origin
                        }
                    }
                )
            } catch (e: any) {
                console.log(`[X] Erro ao tentar enviar lote_serie_setor ID: ${id} ${e.response?.data}`)
            }
        }

    }

    private mappingToShipping(resultLotesSeries: lote_serie_setor) {
        const { ESTOQUE, LOTE_SERIE, PRODUTO, SETOR } = resultLotesSeries;

        return {
            setor: Number(SETOR),
            produto: Number(PRODUTO),
            lote_serie: Number(LOTE_SERIE),
            estoque: Number(ESTOQUE)
        }
    }

    async bulkSyncLoteSerieSector() {
        try {

            const arrLotesSeriesSetor = await this.loteSerieSectorRepository.findAll();

            console.log(`[!] Encontrado ${arrLotesSeriesSetor.length} de registros no lote_serie_setor.`)

            const CHUNK_SIZE = 5000;

            let acumulator = 0;
            for (let i = 0; i < arrLotesSeriesSetor.length; i += CHUNK_SIZE) {
                const chunk = arrLotesSeriesSetor.slice(i, i + CHUNK_SIZE);
                const payload = chunk.map((i) => {
                    return this.mappingToShipping(i);

                });
                acumulator += chunk.length;

                await delay(1000, `[V] Enviando ${acumulator} de ${arrLotesSeriesSetor.length}...`);

                await this.api.put<responseBulUpdateLoteSerieSector>("/bulk/lote-serie-setor", payload);
            }
            return { success: true, message: "ok", data: null };

        } catch (error) {
            throw error;

        }
    }

}

