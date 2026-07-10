import { isAxiosError } from "axios"
import { api } from "../../services/api.ts"

export type resultLoteSerieRequest = 
  {
        codigo: number
        produto:number
        lote: string | null 
        serie:string | null 
        data_cadastro: string
        data_recadastro: string
        }

type inputPostLoteSerie = {
   codigo:  number ,
   produto:  number,
   lote: string | null,
   serie: string | null
}

  export class LoteSeriesRequest{

    private origin = process.env.API_ORIGIN_NAME || 'erp_integration';

    static async   getLoteSeriesRequest ( codigo:number) {

            try{
                const result = await api.get(`/lotes-series/search`, {
                    params : {
                        codigo
                    }
                });
                return result.data as resultLoteSerieRequest[]
            }catch(e){
                console.log(`[X] Erro ao consultar lote-serie na api `,e);
                throw e; 
            }
    } 

    static async post (loteSerie: inputPostLoteSerie ){
        
                let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultLoteSerieRequest | null }
        
                    const  { codigo, lote, produto ,serie }  = loteSerie;       
                try {
        
                    const payload = { 
                        codigo: Number(codigo), 
                         lote: lote == null ? '' : lote,
                         produto ,
                         serie };

                    const resultPost = await api.post("/lotes-series", payload,
                        {
                            headers: {
                                source: new LoteSeriesRequest().origin
                            }
                        }
                    )
        
                    if (resultPost.status === 201) {
                        resultfunction.data = resultPost.data as resultLoteSerieRequest;
                        resultfunction.success = true;
                    }
        
                } catch (e) {
                    resultfunction.success = false;
                    if (isAxiosError(e)) {
                        resultfunction.message = e.response?.data.message;
                    } else {
                        resultfunction.message = `[x] Erro inesperado ao tentar registrar lote serie na api, payload ${loteSerie}. ${e} `;
                    }
        
                } finally {
                    return resultfunction;
                }
    }

    static async put(loteSerie: Omit<inputPostLoteSerie, 'codigo'>, id_mobile: number) {
            let resultfunction = { success: false, message: null, data: null } as { success: boolean, message: string | null, data: resultLoteSerieRequest | null }

                const {lote , produto, serie,  } = loteSerie;
    
            try {
               
                    const payload = {
                        codigo: Number(id_mobile) ,
                        lote: lote == null ? '' : lote,
                         produto ,
                         serie
                         };
    
                const resultPut = await api.put("/lotes-series", payload,
                    {
                        headers: {
                            source: new LoteSeriesRequest().origin
                        }
                    }
                )
                if (resultPut.status === 200) {
                    resultPut.data as { codigo: number, id: number, data_cadastro: string, data_recadastro: string, descricao: string, ativo: 'S' | 'N' };
                    resultfunction.success = true;
                    resultfunction.data = resultPut.data;
                }
    
            } catch (e) {
                resultfunction.success = false;
                if (isAxiosError(e)) {
                    resultfunction.message = e.response?.data.message;
                        resultfunction = e.response?.data
                } else {
                    resultfunction.message = `[x] Erro inesperado ao tentar atualizar lote serie na api, payload ${loteSerie}. ${e} `;
                }
    
            } finally {
                return resultfunction;
            }
    }

  }
