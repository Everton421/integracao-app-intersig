export type erpRequeriment = {  
CODIGO:number
DATA_REQUER:string
REQUERENTE:number
DATA_EFETUACAO: string
RESPONSAVEL:number
PEDIDO:number
CENTRO_CUSTO:number
ORIGEM:number
DESTINO:number
HISTORICO:string
SITUACAO:'A' | 'C' | 'E'
}

export type prodRequer = {
 REQUER:number
 PRODUTO:number
 DESCRICAO:string
 QUANTIDADE:number
 CUSTO:number
 SEPARADO:'string'
}

export type loteSerieRequer = {
    REQUER:number
    PRODUTO:number
    LOTE_SERIE:number
    QUANTIDADE:number
}


