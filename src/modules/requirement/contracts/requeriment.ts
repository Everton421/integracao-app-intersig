
export type payloadRequestRequirement = 
{
    codigo?:number
   requerente: number,
   responsavel: number,
   setor_origem: number,
   setor_destino: number,
   historico: string,
   itens: productPayloadRequeriment[],
   data_efetuacao : string,
   situacao :   'A' | 'C' | 'E' 
}

export type productPayloadRequeriment = {
       produto: number,
       quantidade: number,
       descricao: string,
       custo: null | number,
       lotes_series: loteSeriePayloadRequeriment []
}

 export type loteSeriePayloadRequeriment=  {
           lote_serie: number,
           quantidade: number
        }
