 
 export interface MessageSeparationOrder {
       pedido: number 
       tipo: number ,
       situacao_separacao: 'N' | 'I' ,
       itens_processados: number,
       series_registradas: number
     }