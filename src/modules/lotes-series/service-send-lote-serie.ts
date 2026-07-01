import { type event } from "../../contracts/event.ts";
import { type table_enviados } from "../../contracts/table-enviados.ts";
import dbConn, { MOBILE, PUBLICO } from "../../database/connection/database-connection.ts";
import { api } from "../../services/api.ts";

type resultLotesSeries ={
    CODIGO:number
    PRODUTO:number
    LOTE:string
    SERIE:string
    FORNECEDOR:number
    DATA_FABRIC:string
    DATA_VALID:string
    }

export async function SendLotesSeries(event: event) {
    
    const sql = `SELECT * FROM ${PUBLICO}.lotes_series WHERE CODIGO =${event.id_registro};`;

    const [ resultQueryLotesSeries] = await dbConn.query(sql);
    const arrLotesSeries = resultQueryLotesSeries as resultLotesSeries[];

        if(arrLotesSeries.length > 0 ){
            const { PRODUTO, LOTE, SERIE ,CODIGO} =arrLotesSeries[0];

              const [ lotesSeriesEnviadas  ] = await dbConn.query(`SELECT * FROM ${MOBILE}.lotes_series_enviadas where codigo_sistema = ${event.id_registro};`);
                const arrVerifylotesSeriesEnviadas = lotesSeriesEnviadas as table_enviados[]

                    const payload = {
                                   codigo: Number(CODIGO),
                                   produto: Number(PRODUTO),
                                   lote: String(LOTE) || '',
                                   serie: String(SERIE) || ''
                            }
                    if(arrVerifylotesSeriesEnviadas.length > 0 ){
                        const { codigo_sistema ,id_mobile } = arrVerifylotesSeriesEnviadas[0];

                        try{
                            const resultApi = await api.put('/lotes-series', payload)
                        }catch(e:any){
                            console.log(`[X] Erro ao tentar atualizar lote serie: ${CODIGO}`)
                            console.log(e.response.data)
                        }
                    }else{
                     try{   
                         const resultApi = await api.post('/lotes-series',payload)
                            if(resultApi.status == 200 || resultApi.status == 201 ){
                                 const insert= `INSERT INTO ${MOBILE}.lotes_series_enviadas set codigo_sistema = ${CODIGO}, id_mobile= ${CODIGO};`;
                                  await dbConn.query(insert);
                            }
                        }catch(e:any){
                            console.log(`[X] Erro ao tentar enviar lote serie: ${CODIGO}`)
                            console.log(e.response.data)

                        }
                    }
        }


}