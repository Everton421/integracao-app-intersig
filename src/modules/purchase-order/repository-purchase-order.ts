import { type ResultSetHeader } from "mysql2"
import dbConn, { MOBILE, PUBLICO, VENDAS } from "../../database/connection/database-connection.ts"
import {
  type IParcelasPedidoSistema, type IProdutoPedidoSistema, type IServicosPedidoSistema
} from "../sales-order/repository-itens-pedido.ts"
import { type cad_comp } from "./contracts/cad_comp.ts"
import {type cad_orca } from "../sales-order/contracts/cad_orca.ts"
import {type par_comp } from "./contracts/par_comp.ts"
import {type pro_comp } from "./contracts/pro_comp.ts"


type resultForn = { CODIGO: number, id_mobile: number }

 
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

   type resultSeriesPedidoCompra = {
             CODIGO:number
             QTDE_SEPARADA:number,
             SERIE:string
             LOTE:string | null
    }
  type resultselectProdutoDoPedidoDeCompra =pro_comp & { controle_lote_serie:'S' | 'N'   }

 


 


export class PurchaseOrderRepository{

static async   updateSeparationPurchaseOrder(orcamento: IPedidoSistema, codigoPedido: number) {
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
 


  static async  selectFornecedorPedido(codigo_fornecedor: number) {
      const sql = ` SELECT f.CODIGO, fe.id_mobile from ${PUBLICO}.cad_forn as f
                            JOIN ${MOBILE}.fornecedores_enviados fe on fe.codigo_sistema = f.CODIGO  
                    where f.codigo = ?  `;
      const values = [codigo_fornecedor]
      const [rows] = await dbConn.query(sql, values);
      return rows as resultForn[];
  }


  static async   selectPedidoSistema(codigo_pedido?: number) {

          const sql = ` SELECT 
                      *,
                      DATE_FORMAT(DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                      DATE_FORMAT(DATA_RECAD, '%Y-%m-%d %H:%i:%s') AS DATA_RECAD,
                      CAST(OBSERVACOES AS CHAR(10000) CHARACTER SET latin1 ) as OBSERVACOES,
                      CAST(OBSERVACOES2 AS CHAR(10000) CHARACTER SET latin1 ) as OBSERVACOES2

                      from ${VENDAS}.cad_orca   `;

          let whereClause = ` ;`
          const values = [];

          if (codigo_pedido && codigo_pedido != undefined) {
            whereClause = ` where codigo = ? ;`;
            values.push(codigo_pedido);
          }

          const finalSql = sql + whereClause

          const [rows] = await dbConn.query(finalSql, values);
          return rows as cad_orca[];
  }


 static async   findPurchaseOrderErp(codigo_pedido?: number) {

        const sql = ` SELECT 
                    *,
                    DATE_FORMAT(DATA_CADASTRO, '%Y-%m-%d') AS DATA_CADASTRO,
                     CAST(OBSERVACOES AS CHAR(10000) CHARACTER SET latin1 ) as OBSERVACOES,
                     CAST(OBSERVACOES2 AS CHAR(10000) CHARACTER SET latin1 ) as OBSERVACOES2

                     from ${VENDAS}.cad_comp   `;

      let whereClause = ` ;`
      const values = [];

      if (codigo_pedido && codigo_pedido != undefined) {
        whereClause = ` where codigo = ? ;`;
        values.push(codigo_pedido);
      }

      const finalSql = sql + whereClause

      const [rows] = await dbConn.query(finalSql, values);
      return rows as cad_comp[];

}

static async   findInstallmentsPurchaseOrder( codigo_pedido:number ){

                    const sql =  ` SELECT 
                     *,
                    DATE_FORMAT(VENCIMENTO, '%Y-%m-%d') AS  VENCIMENTO
                     from ${VENDAS}.par_comp
                      where  ordem = ?  `;
                            const values =[codigo_pedido ]
                             const [ rows ] =  await dbConn.query( sql, values );
                return rows as par_comp[];
                  
    }

    static async    findSeriesPurchaseOrder(codigo_pedido:number) {
        const sql = `SELECT 
            ls.CODIGO,
            lsc.QTDE_SEPARADA,
            ls.SERIE,
            ls.LOTE 
                    FROM ${VENDAS}.lotes_series_comp lsc 
                    JOIN ${PUBLICO}.lotes_series ls
                    on ls.CODIGO = lsc.LOTE_SERIE
                    WHERE lsc.ORDEM = '${codigo_pedido}'
            `
            const [ rows ] =  await dbConn.query( sql );
        return rows as resultSeriesPedidoCompra[]
}

         static async  findItemsPurchaseOrder( codigo_pedido:number ){

                    const sql =  ` SELECT 
                    pc.*,
                    pe.id_mobile as id,
                    cp.CONTR_LOTE_SERIE as controle_lote_serie 
                     from ${VENDAS}.pro_comp pc
                     join ${MOBILE}.produtos_enviados pe on pe.codigo_sistema = pc.PRODUTO
                     join ${PUBLICO}.cad_prod cp on cp.CODIGO = pc.PRODUTO
                      where pc.ORDEM = ?  `;
                            const values =[codigo_pedido ]
                             const [ rows ] =  await dbConn.query( sql, values );
                return rows as resultselectProdutoDoPedidoDeCompra[];
                  
    }

}