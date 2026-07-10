import { type event } from "../../contracts/event.ts";
import dbConn, { ESTOQUE } from "../../database/connection/database-connection.ts";
import { api } from "../../services/api.ts";

type resultLotesSeries ={
    SETOR:number
    PRODUTO:number
    LOTE_SERIE:number
    ESTOQUE:number
    id:number
    }

export async function SendLoteSerieSetor(event: event) {
     const origin = process.env.API_ORIGIN_NAME || 'erp_integration';
    
    const sql = `SELECT * FROM ${ESTOQUE}.lote_serie_setor WHERE id =${event.id_registro};`;

    const [ resultQueryLotesSeriesSetor] = await dbConn.query(sql);
    const arrLotesSeriesSetor = resultQueryLotesSeriesSetor as resultLotesSeries[];

        if(arrLotesSeriesSetor.length > 0 ){

            const {ESTOQUE, LOTE_SERIE, PRODUTO, SETOR, id } = arrLotesSeriesSetor[0];

                try{
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
                }catch(e:any){
                    console.log(`[X] Erro ao tentar enviar lote_serie_setor ID: ${id} ${e.response?.data}`)
                }
        }


}