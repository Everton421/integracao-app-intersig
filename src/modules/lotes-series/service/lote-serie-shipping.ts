import { type event } from "../../../contracts/event.ts";
import { ApiClient } from "../../../services/api-client.ts";
import { delay } from "../../../utils/delay.ts";
import { type lotes_series } from "../contracts/lotes_series.ts";
import { LoteSerieRepository } from "../repository/lote-serie-repository.ts";

type responseloteSerieRequest= {
   codigo: number,
   produto: number,
   lote: string | null,
   serie: string | null,
   data_cadastro: string,
   data_recadastro: string
}

export  class LoteSerieShipping { 
        private loteSerieRepository:LoteSerieRepository
        private api: ApiClient;

    constructor(loteSerieRepository:LoteSerieRepository,  api: ApiClient ){
        this.loteSerieRepository=loteSerieRepository;
        this.api=api;
    }

    private mappingToShipping(lotes_serie: lotes_series){
        const  {CODIGO, PRODUTO, LOTE, SERIE} = lotes_serie;
        return {
                 codigo: Number(CODIGO),
                        produto: Number(PRODUTO),
                        lote: String(LOTE) || null,
                        serie: String(SERIE) || null
        }
    }

    async shippingByEvent(event: event){
        const origin = process.env.API_ORIGIN_NAME || 'erp_integration';

            try {
                const   [dataloteSerie] = await this.loteSerieRepository.findByCode(event.id_registro);

                    const  dataToShipping = this.mappingToShipping(dataloteSerie);
                const response = await this.api.post<responseloteSerieRequest>("/lotes-series", dataToShipping,
                        {
                            headers: {
                                source: origin
                            }
                        }
                    );
                    if(response.status == 200 ){
                            const { codigo  } =response.data;
                        await this.loteSerieRepository.insertSynced(codigo, event.id_registro);
                    } 

                    return { succes:true, message:'OK', data: response.data };
            } catch (error) {
                    throw error;
         }
    }

    async bulkShippingLoteSerie(){
        try {

            const dataloteSerie = await this.loteSerieRepository.findAll();
                const CHUNK_SIZE = 5000;
                let acumulator = 0;

            console.log(`[!] Encontrado ${dataloteSerie.length} de registros no lote_serie.`)


                    for(let i = 0; i < dataloteSerie.length; i +=CHUNK_SIZE ){
                        const chunk = dataloteSerie.slice(i, i + CHUNK_SIZE);
                        const payload = chunk.map( ( i )=>{
                            return this.mappingToShipping(i);
                        })

                        acumulator += chunk.length;
                        await delay(1000, `[V] Enviando ${acumulator} de ${dataloteSerie.length}...`)
                    
                         await this.api.post("/bulk/lotes-series", payload);

                    }
        } catch (error) {
                throw error
        }

    }
}