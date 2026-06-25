import { type ResultSetHeader } from "mysql2"
import dbConn, { VENDAS } from "../../database/connection/database-connection.ts"
import {
  type IParcelasPedidoSistema, type IProdutoPedidoSistema, type IServicosPedidoSistema
} from "../sales-order/repository-itens-pedido.ts"



 
export interface IPedidoSistema {
  codigo: number
  id: number
  id_externo: number
  vendedor: number
  situacao: string
  contato: string
  descontos: number
  forma_pagamento: number
  observacoes: string
  observacoes2: string
  quantidade_parcelas: number
  total_geral: number
  total_produtos: number
  total_servicos: number
  situacao_separacao:'N' | 'I' | 'P'
  data_cadastro: string
  data_recadastro: string
  enviado: string
  tipo: number
  just_ipi: string
  just_icms: string
  just_subst: string
  frete: number
  fornecedor:{
    id:string,
    codigo:number
  }
  produtos: IProdutoPedidoSistema[]
  servicos: IServicosPedidoSistema[]
  parcelas: IParcelasPedidoSistema[]
}

 

export async function updatePedidoCompra(orcamento: IPedidoSistema, codigoPedido: number) {
  const produtos = orcamento.produtos as IProdutoPedidoSistema[];
  let  resultFunction  =  { sucess: true, message: ''};
  try{

    let sql = `
                    UPDATE ${VENDAS}.cad_comp  
                    set 
                    SIT_SEPAR = '${orcamento.situacao_separacao}' 
                    WHERE CODIGO = '${codigoPedido}'
                `;

      const [rows] = await dbConn.query(sql);

      const resultUpdatePdido = rows as ResultSetHeader;
      if (resultUpdatePdido.affectedRows > 0) {

        if (orcamento.produtos.length > 0) {
          for( const product of produtos ){

            const sql = `UPDATE ${VENDAS}.pro_comp set
                  QTDE_SEPARADA = ${product.quantidade_separada}
                  WHERE ORDEM = '${codigoPedido}' AND SEQUENCIA = '${product.sequencia}';
              `
            await dbConn.query(sql)

          }
          resultFunction.sucess = true;

          }
        }else{
          resultFunction.message = "Nenhuma alteração ocorreu no pedido.";
          resultFunction.sucess = false;
          
        }

        return    resultFunction 
      
  }catch(e){
          resultFunction.sucess = false;
          resultFunction.message = e as any;
        return    resultFunction 

      }finally{
        return    resultFunction 
      }


}
 